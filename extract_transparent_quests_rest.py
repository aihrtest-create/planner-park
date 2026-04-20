import fitz
import io
import os
from PIL import Image
from rembg import remove

QUESTS_MAPPING = {
    "classic_pirates": 87,    # Пират и Пиратка
    "classic_wednesday": 44,  # Уэнсдей
    "classic_bloggers": 82,   # Блогеры
}

PDF_PATH = "Каталог с Аниматорами small страницы.pdf"
OUT_DIR = "public/quests/transparent"

doc = fitz.open(PDF_PATH)

for name, page_idx in QUESTS_MAPPING.items():
    page = doc[page_idx]
    images = page.get_images(full=True)
    
    max_size = 0
    best_img_bytes = None
    
    for img in images:
        xref = img[0]
        base_image = doc.extract_image(xref)
        img_bytes = base_image["image"]
        if len(img_bytes) > max_size:
            max_size = len(img_bytes)
            best_img_bytes = img_bytes
            
    if best_img_bytes:
        print(f"Processing {name}... source size: {max_size} bytes")
        img = Image.open(io.BytesIO(best_img_bytes)).convert("RGBA")
        out_img = remove(img)
        bbox = out_img.getbbox()
        if bbox:
            out_img = out_img.crop(bbox)
        out_path = os.path.join(OUT_DIR, f"{name}.png")
        out_img.save(out_path)
        print(f"Saved {name}.png")

print("Done!")
