import os
from PIL import Image
from rembg import remove

IMG_DIR = "processed_pdfs/Каталог с Аниматорами small страницы/images"
OUT_DIR = "public/quests/transparent"

QUESTS = {
    "classic_squid": f"{IMG_DIR}/image_p64_190.jpeg",
    "classic_barbie": f"{IMG_DIR}/image_p61_181.jpeg",
    "classic_safari": f"{IMG_DIR}/image_p78_232.jpeg",
    "classic_harry": f"{IMG_DIR}/image_p42_124.jpeg",
    "classic_heroes": f"{IMG_DIR}/image_p20_58.jpeg",
    "classic_pirates": f"{IMG_DIR}/image_p88_261.jpeg",
    "classic_wednesday": f"{IMG_DIR}/image_p44_130.jpeg",
    "classic_bloggers": f"{IMG_DIR}/image_p82_245.jpeg",
}

os.makedirs(OUT_DIR, exist_ok=True)

for name, path in QUESTS.items():
    if not os.path.exists(path):
        print(f"File not found: {path}")
        continue
        
    print(f"Processing {name} from {path}...")
    im = Image.open(path)
    if im.mode != "RGBA":
        im = im.convert("RGBA")
        
    out_img = remove(im)
    bbox = out_img.getbbox()
    if bbox:
        out_img = out_img.crop(bbox)
        
    out_path = os.path.join(OUT_DIR, f"{name}.png")
    out_img.save(out_path)
    print(f"Saved {name}.png")

print("All done!")
