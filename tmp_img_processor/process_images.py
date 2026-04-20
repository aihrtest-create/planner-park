import os
import rembg
from PIL import Image

quests_dir = "/Users/dima/Desktop/DR-construct(Anti)/public/quests"
output_dir = "/Users/dima/Desktop/DR-construct(Anti)/public/quests_transparent"

os.makedirs(output_dir, exist_ok=True)

files = [f for f in os.listdir(quests_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]

for f in files:
    input_path = os.path.join(quests_dir, f)
    output_filename = os.path.splitext(f)[0] + ".png"
    output_path = os.path.join(output_dir, output_filename)
    
    # Check if already processed
    if os.path.exists(output_path):
        print(f"Skipping {f}, already processed.")
        continue
        
    print(f"Processing {f}...")
    try:
        input_image = Image.open(input_path).convert("RGBA")
        output_image = rembg.remove(input_image)
        output_image.save(output_path)
        print(f"Saved {output_filename}")
    except Exception as e:
        print(f"Error processing {f}: {e}")

print("Done processing images!")
