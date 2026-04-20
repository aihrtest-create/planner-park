import fitz
import os

os.makedirs('scratch', exist_ok=True)
doc = fitz.open('Каталог с Аниматорами small страницы.pdf')
page = doc[64] # 0-indexed, so page 65 is index 64
images = page.get_images(full=True)
print(f"Images on page 65: {len(images)}")
for i, img in enumerate(images):
    xref = img[0]
    base_image = doc.extract_image(xref)
    image_ext = base_image["ext"]
    image_colorspace = base_image["colorspace"]
    image_alpha = base_image.get("alpha", False)
    smask = img[1]
    print(f"Image {i}: ext={image_ext}, colorspace={image_colorspace}, smask={smask}, alpha={image_alpha}")
    with open(f"scratch/test_img_{i}.{image_ext}", "wb") as f:
        f.write(base_image["image"])

    if smask > 0:
        mask_image = doc.extract_image(smask)
        with open(f"scratch/test_mask_{i}.{mask_image['ext']}", "wb") as f:
            f.write(mask_image["image"])
