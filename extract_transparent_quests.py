import fitz
import io
import os
from PIL import Image
from rembg import remove

# Mapping: target_filename -> page_index (0-indexed)
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

print("Opening PDF...")
doc = fitz.open(PDF_PATH)

for name, page_idx in QUESTS_MAPPING.items():
    print(f"Processing {name} (page {page_idx + 1})...")
    page = doc[page_idx]
    
    # Render page to high-res image
    pix = page.get_pixmap(matrix=fitz.Matrix(3, 3))
    
    # Convert fitz pixmap to PIL Image
    img_data = pix.tobytes("png")
    img = Image.open(io.BytesIO(img_data)).convert("RGBA")
    
    # Remove background
    out_img = remove(img)
    
    # Crop to bounding box
    bbox = out_img.getbbox()
    if bbox:
        out_img = out_img.crop(bbox)
        
    out_path = os.path.join(OUT_DIR, f"{name}.png")
    out_img.save(out_path)
    print(f"Saved {name}.png")

print("Done!")
