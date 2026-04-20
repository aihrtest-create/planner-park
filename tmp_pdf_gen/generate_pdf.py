#!/usr/bin/env python3
"""Converts the DR Analytics Report from Markdown to a styled PDF."""

import markdown
from weasyprint import HTML
import os
import re

# --- Configuration ---
INPUT_MD = "/Users/dima/.gemini/antigravity/brain/3c28809a-c7e0-47e2-927d-038864305b1e/artifacts/dr_analytics_report.md.resolved"
OUTPUT_DIR = "/Users/dima/Desktop"
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "DR_Analytics_Report_March2026.pdf")

# --- Read Markdown ---
with open(INPUT_MD, "r", encoding="utf-8") as f:
    md_content = f.read()

# --- Pre-process: Convert GitHub-style alerts to styled HTML ---
def convert_alerts(md_text):
    """Convert > [!TYPE] > text patterns to styled divs."""
    # Pattern: > [!TYPE]\n> text (possibly multi-line)
    alert_pattern = re.compile(
        r'> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:> .*\n?)+)',
        re.MULTILINE
    )
    
    def alert_replacer(match):
        alert_type = match.group(1).lower()
        content = match.group(2)
        # Remove > prefix from each line
        content_lines = []
        for line in content.split('\n'):
            line = re.sub(r'^>\s?', '', line)
            content_lines.append(line)
        content_html = '<br>'.join(line for line in content_lines if line.strip())
        
        icons = {
            'note': 'ℹ️',
            'tip': '💡',
            'important': '❗',
            'warning': '⚠️',
            'caution': '🔴'
        }
        icon = icons.get(alert_type, 'ℹ️')
        
        return f'<div class="alert alert-{alert_type}"><span class="alert-icon">{icon}</span> {content_html}</div>\n'
    
    return alert_pattern.sub(alert_replacer, md_text)

# --- Pre-process: Remove mermaid blocks (not renderable in PDF) and replace with placeholder ---
def convert_mermaid(md_text):
    """Remove mermaid code blocks - they can't render in static PDF."""
    mermaid_pattern = re.compile(r'```mermaid\n(.*?)```', re.DOTALL)
    
    def mermaid_replacer(match):
        content = match.group(1).strip()
        # Try to extract meaningful text from mermaid
        if 'pie title' in content:
            title = re.search(r'pie title (.+)', content)
            title_text = title.group(1) if title else "Диаграмма"
            items = re.findall(r'"([^"]+)"', content)
            items_html = ''.join(f'<li>{item}</li>' for item in items)
            return f'<div class="chart-placeholder"><strong>📊 {title_text}</strong><ul>{items_html}</ul></div>'
        elif 'graph' in content:
            # Extract node labels
            labels = re.findall(r'\["([^"]+)"\]', content)
            if labels:
                items_html = ' → '.join(labels)
                return f'<div class="chart-placeholder"><strong>📋 Последовательность шагов:</strong><br><div class="flow-steps">{items_html}</div></div>'
        return '<div class="chart-placeholder"><em>Диаграмма (см. онлайн версию)</em></div>'
    
    return mermaid_pattern.sub(mermaid_replacer, md_text)

# --- Pre-process: Handle blockquotes that aren't alerts ---
def convert_plain_quotes(md_text):
    """Convert plain > quotes (without [!TYPE]) to styled blockquotes."""
    # Already handled by markdown parser, but let's ensure they look good
    return md_text

md_content = convert_alerts(md_content)
md_content = convert_mermaid(md_content)

# --- Convert Markdown to HTML ---
html_body = markdown.markdown(
    md_content,
    extensions=['tables', 'fenced_code', 'codehilite', 'toc'],
    extension_configs={
        'codehilite': {'css_class': 'highlight', 'guess_lang': False}
    }
)

# --- Create full HTML with styles ---
html_full = f"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Аналитический отчёт: Банкеты ДР / Март 2026</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@page {{
    size: A4;
    margin: 20mm 18mm 25mm 18mm;
    
    @top-center {{
        content: "Hello Park Селигерская — Аналитика ДР Март 2026";
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
    }}
    
    @bottom-center {{
        content: counter(page) " / " counter(pages);
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
    }}
}}

@page :first {{
    @top-center {{
        content: "";
    }}
}}

* {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}}

body {{
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 10pt;
    line-height: 1.6;
    color: #1e293b;
    background: #fff;
}}

/* ---- Headings ---- */
h1 {{
    font-size: 22pt;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 4pt;
    padding-bottom: 8pt;
    border-bottom: 3px solid #6366f1;
    line-height: 1.3;
}}

h2 {{
    font-size: 15pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 18pt;
    margin-bottom: 8pt;
    padding-bottom: 4pt;
    border-bottom: 2px solid #e2e8f0;
    page-break-after: avoid;
}}

h3 {{
    font-size: 12pt;
    font-weight: 600;
    color: #334155;
    margin-top: 12pt;
    margin-bottom: 6pt;
    page-break-after: avoid;
}}

h4 {{
    font-size: 10pt;
    font-weight: 600;
    color: #475569;
    margin-top: 10pt;
    margin-bottom: 4pt;
}}

/* ---- Paragraphs ---- */
p {{
    margin-bottom: 8pt;
    text-align: justify;
}}

/* ---- Tables ---- */
table {{
    width: 100%;
    border-collapse: collapse;
    margin: 8pt 0 12pt 0;
    font-size: 9pt;
    page-break-inside: avoid;
}}

thead {{
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
}}

thead th {{
    color: #fff;
    font-weight: 600;
    padding: 8pt 10pt;
    text-align: left;
    border: none;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.3pt;
}}

thead th:first-child {{
    border-radius: 6pt 0 0 0;
}}

thead th:last-child {{
    border-radius: 0 6pt 0 0;
}}

tbody tr {{
    border-bottom: 1px solid #e2e8f0;
}}

tbody tr:nth-child(even) {{
    background-color: #f8fafc;
}}

tbody tr:hover {{
    background-color: #f1f5f9;
}}

tbody td {{
    padding: 6pt 10pt;
    vertical-align: top;
}}

tbody td strong {{
    color: #4338ca;
}}

/* ---- Code blocks ---- */
pre {{
    background: #1e293b;
    color: #e2e8f0;
    padding: 12pt 14pt;
    border-radius: 8pt;
    font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
    font-size: 8pt;
    line-height: 1.5;
    margin: 8pt 0 12pt 0;
    overflow-x: auto;
    page-break-inside: avoid;
    white-space: pre-wrap;
    word-wrap: break-word;
}}

code {{
    font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
    font-size: 8.5pt;
    background: #f1f5f9;
    color: #6366f1;
    padding: 1pt 4pt;
    border-radius: 3pt;
}}

pre code {{
    background: none;
    color: inherit;
    padding: 0;
}}

/* ---- Alerts ---- */
.alert {{
    padding: 10pt 14pt;
    border-radius: 8pt;
    margin: 8pt 0 12pt 0;
    font-size: 9pt;
    line-height: 1.5;
    page-break-inside: avoid;
}}

.alert-icon {{
    font-size: 12pt;
    margin-right: 4pt;
}}

.alert-note {{
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    color: #1e40af;
}}

.alert-tip {{
    background: #f0fdf4;
    border-left: 4px solid #22c55e;
    color: #166534;
}}

.alert-important {{
    background: #fef3c7;
    border-left: 4px solid #f59e0b;
    color: #92400e;
}}

.alert-warning {{
    background: #fef2f2;
    border-left: 4px solid #ef4444;
    color: #991b1b;
}}

.alert-caution {{
    background: #fef2f2;
    border-left: 4px solid #dc2626;
    color: #7f1d1d;
}}

/* ---- Blockquotes ---- */
blockquote {{
    border-left: 4px solid #6366f1;
    padding: 8pt 12pt;
    margin: 8pt 0;
    background: #f8fafc;
    color: #475569;
    border-radius: 0 6pt 6pt 0;
    font-style: italic;
}}

/* ---- Lists ---- */
ol, ul {{
    margin: 6pt 0 10pt 18pt;
}}

li {{
    margin-bottom: 4pt;
}}

/* ---- Horizontal rules ---- */
hr {{
    border: none;
    border-top: 2px solid #e2e8f0;
    margin: 16pt 0;
}}

/* ---- Chart placeholders ---- */
.chart-placeholder {{
    background: linear-gradient(135deg, #f8fafc, #eef2ff);
    border: 2px dashed #c7d2fe;
    border-radius: 10pt;
    padding: 14pt 18pt;
    margin: 10pt 0;
    text-align: center;
    color: #4338ca;
    page-break-inside: avoid;
}}

.chart-placeholder ul {{
    list-style: none;
    margin: 8pt 0 0 0;
    padding: 0;
}}

.chart-placeholder li {{
    display: inline-block;
    background: #6366f1;
    color: white;
    padding: 3pt 10pt;
    border-radius: 12pt;
    margin: 3pt;
    font-size: 8.5pt;
    font-weight: 500;
}}

.flow-steps {{
    font-size: 8.5pt;
    line-height: 2;
    margin-top: 6pt;
    text-align: left;
    color: #334155;
}}

/* ---- Special: first section styling ---- */
h1 + h2 {{
    color: #6366f1;
    font-size: 13pt;
    border-bottom: none;
    margin-top: 2pt;
}}

/* ---- Page breaks ---- */
h2 {{
    page-break-before: auto;
}}

/* Force page break before major sections */
</style>
</head>
<body>
{html_body}
</body>
</html>
"""

# --- Generate PDF ---
print("Generating PDF...")
HTML(string=html_full).write_pdf(OUTPUT_PDF)
print(f"✅ PDF saved to: {OUTPUT_PDF}")
