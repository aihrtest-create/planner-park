import fitz
PDF_PATH = "Каталог с Аниматорами small страницы.pdf"
doc = fitz.open(PDF_PATH)
print("Total pages:", len(doc))
