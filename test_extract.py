import fitz
import os
from PIL import Image

doc = fitz.open('Каталог с Аниматорами small страницы.pdf')
page = doc[64] # Охранники (page 65)
images = page.get_images(full=True)
for i, img in enumerate(images):
    xref = img[0]
    base_image = doc.extract_image(xref)
    with open(f"scratch/squid_native_{i}.{base_image['ext']}", "wb") as f:
        f.write(base_image["image"])
