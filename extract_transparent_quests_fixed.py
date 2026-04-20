import fitz
import io
import os
from PIL import Image
from rembg import remove

QUESTS_MAPPING = {
    "classic_squid": 64,      # Охранники
    "classic_barbie": 61,     # Барби и Кен
    "classic_safari": 78,     # Палеонтолог
    "classic_harry": 42,      # Гарри и Гермиона
    "classic_heroes": 20,     # Дэдпул и Человек-паук
    "classic_pirates": 88,    # Пират и Пиратка
    "classic_wednesday": 44,  # Уэнсдей
    "classic_bloggers": 82,   # Блогеры
}

PDF_PATH = "Каталог с Аниматорами small страницы.pdf"
OUT_DIR = "public/quests/transparent"
os.makedirs(OUT_DIR, exist_ok=True)

doc = fitz.open(PDF_PATH)

for name, page_idx in QUESTS_MAPPING.items():
    page = doc[page_idx]
    images = page.get_images(full=True)
    
    # Find the largest image on the page (usually the character photo)
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
        
        # Remove background using rembg
        out_img = remove(img)
        
        # Crop to bounding box
        bbox = out_img.getbbox()
        if bbox:
            out_img = out_img.crop(bbox)
            
        out_path = os.path.join(OUT_DIR, f"{name}.png")
        out_img.save(out_path)
        print(f"Saved {name}.png")

print("Done!")
