#!/usr/bin/env python3
"""Converts the DR Analytics Report from Markdown to a styled HTML, then saves it for Chrome."""

import markdown
import os
import re

# --- Configuration ---
INPUT_MD = "/Users/dima/.gemini/antigravity/brain/3c28809a-c7e0-47e2-927d-038864305b1e/artifacts/dr_analytics_report.md.resolved"
OUTPUT_DIR = "/Users/dima/Desktop/DR-construct(Anti)"
OUTPUT_HTML = os.path.join(OUTPUT_DIR, "temp_report.html")

# --- Read Markdown ---
with open(INPUT_MD, "r", encoding="utf-8") as f:
    md_content = f.read()

# --- Pre-process: Convert GitHub-style alerts to styled HTML ---
def convert_alerts(md_text):
    alert_pattern = re.compile(
        r'> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:> .*\n?)+)',
        re.MULTILINE
    )
    
    def alert_replacer(match):
        alert_type = match.group(1).lower()
        content = match.group(2)
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

md_content = convert_alerts(md_content)

# --- Convert Markdown to HTML ---
html_body = markdown.markdown(
    md_content,
    extensions=['tables', 'fenced_code', 'codehilite', 'toc']
)

# Replace mermaid code blocks with parsed chart div
mermaid_pattern = re.compile(r'<pre><code class="language-mermaid">(.*?)</code></pre>', re.DOTALL)
def mermaid_replacer(match):
    content = match.group(1).strip()
    if 'pie title' in content:
        title = re.search(r'pie title (.+)', content)
        title_text = title.group(1) if title else "Диаграмма"
        items = re.findall(r'&quot;([^&]+)&quot;\s*:\s*(\d+)', content)
        items_html = ''.join(f'<li>{item[0]} : {item[1]}</li>' for item in items)
        return f'<div class="chart-placeholder"><strong>📊 {title_text}</strong><ul>{items_html}</ul></div>'
    elif 'graph' in content:
        # Extract node labels
        labels = re.findall(r'\[&quot;([^&]+)&quot;\]', content)
        if labels:
            items_html = ' → '.join(labels).replace('<br/>', ' ')
            return f'<div class="chart-placeholder"><strong>📋 Выбор пользователей:</strong><br><div class="flow-steps">{items_html}</div></div>'
    return '<div class="chart-placeholder"><em>Диаграмма (см. онлайн версию)</em></div>'
html_body = mermaid_pattern.sub(mermaid_replacer, html_body)


# --- Create full HTML with styles ---
html_full = f"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Аналитический отчёт: Банкеты ДР / Март 2026</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

body {{
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #1e293b;
    background: #fff;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px;
}}

/* For printing */
@media print {{
    body {{
        padding: 0;
        max-width: none;
    }}
    @page {{
        margin: 20mm;
    }}
    h2 {{
        page-break-before: auto;
    }}
    pre, blockquote, table {{
        page-break-inside: avoid;
    }}
}}

h1 {{
    font-size: 28px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 10px;
    padding-bottom: 15px;
    border-bottom: 3px solid #6366f1;
    line-height: 1.3;
}}

h2 {{
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 30px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e2e8f0;
}}

h3 {{
    font-size: 18px;
    font-weight: 600;
    color: #334155;
    margin-top: 25px;
    margin-bottom: 15px;
}}

p {{
    margin-bottom: 15px;
}}

table {{
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0 25px 0;
    font-size: 13px;
}}

thead {{
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
}}

thead th {{
    color: #fff;
    font-weight: 600;
    padding: 12px 15px;
    text-align: left;
    border: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}}

thead th:first-child {{ border-radius: 8px 0 0 0; }}
thead th:last-child {{ border-radius: 0 8px 0 0; }}

tbody tr {{
    border-bottom: 1px solid #e2e8f0;
}}

tbody tr:nth-child(even) {{
    background-color: #f8fafc;
}}

tbody td {{
    padding: 10px 15px;
    vertical-align: top;
}}

tbody td strong {{
    color: #4338ca;
}}

pre {{
    background: #1e293b;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    line-height: 1.5;
    margin: 15px 0 25px 0;
    white-space: pre-wrap;
}}

code {{
    font-family: monospace;
    font-size: 13px;
    background: #f1f5f9;
    color: #6366f1;
    padding: 2px 6px;
    border-radius: 4px;
}}

pre code {{
    background: none;
    color: inherit;
    padding: 0;
}}

.alert {{
    padding: 15px 20px;
    border-radius: 8px;
    margin: 15px 0 25px 0;
    font-size: 14px;
    line-height: 1.5;
}}

.alert-icon {{
    font-size: 18px;
    margin-right: 8px;
}}

.alert-note {{ background: #eff6ff; border-left: 4px solid #3b82f6; color: #1e40af; }}
.alert-tip {{ background: #f0fdf4; border-left: 4px solid #22c55e; color: #166534; }}
.alert-important {{ background: #fef3c7; border-left: 4px solid #f59e0b; color: #92400e; }}
.alert-warning {{ background: #fef2f2; border-left: 4px solid #ef4444; color: #991b1b; }}

blockquote {{
    border-left: 4px solid #6366f1;
    padding: 10px 15px;
    margin: 15px 0;
    background: #f8fafc;
    color: #475569;
    border-radius: 0 8px 8px 0;
    font-style: italic;
}}

ul {{
    margin: 10px 0 20px 25px;
}}

hr {{
    border: none;
    border-top: 2px solid #e2e8f0;
    margin: 30px 0;
}}

.chart-placeholder {{
    background: linear-gradient(135deg, #f8fafc, #eef2ff);
    border: 2px dashed #c7d2fe;
    border-radius: 12px;
    padding: 20px 25px;
    margin: 20px 0;
    text-align: center;
    color: #4338ca;
}}
.chart-placeholder ul {{ list-style: none; margin: 15px 0 0 0; padding: 0; }}
.chart-placeholder li {{
    display: inline-block;
    background: #6366f1;
    color: white;
    padding: 6px 15px;
    border-radius: 20px;
    margin: 5px;
    font-size: 13px;
    font-weight: 500;
}}
.flow-steps {{ font-size: 13px; line-height: 2; margin-top: 10px; color: #334155; }}
</style>
</head>
<body>
{html_body}
</body>
</html>
"""

# --- Save HTML ---
with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html_full)

print(f"HTML saved to: {{OUTPUT_HTML}}")
