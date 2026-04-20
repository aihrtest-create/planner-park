import os
from PIL import Image, ImageChops

def trim_white(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0, 0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

os.makedirs('public/animators/cropped', exist_ok=True)
IMG_DIR = 'processed_pdfs/Каталог с Аниматорами small страницы/images'

# Remaining 35 single animators
animators = {
    'anna.jpg':             f'{IMG_DIR}/image_p3_6.jpeg',
    'aurora.jpg':           f'{IMG_DIR}/image_p5_13.jpeg',
    'snow_white.jpg':       f'{IMG_DIR}/image_p7_19.jpeg',
    'jasmine.jpg':          f'{IMG_DIR}/image_p8_23.jpeg',
    'cinderella.jpg':       f'{IMG_DIR}/image_p9_25.jpeg',
    'maui.jpg':             f'{IMG_DIR}/image_p12_35.jpeg',
    'green_creeper.jpg':    f'{IMG_DIR}/image_p25_72.jpeg',
    'roblox_girl.jpg':      f'{IMG_DIR}/image_p27_78.jpeg',
    'roblox_boy.jpg':       f'{IMG_DIR}/image_p28_81.jpeg',
    'roblox_blue.jpg':      f'{IMG_DIR}/image_p30_87.jpeg',
    'brawl_shelly.jpg':     f'{IMG_DIR}/image_p32_93.jpeg',
    'kissy_missy.jpg':      f'{IMG_DIR}/image_p36_105.jpeg',
    'hermione.jpg':         f'{IMG_DIR}/image_p41_122.jpeg',
    'enid.jpg':             f'{IMG_DIR}/image_p43_127.jpeg',
    'donatello.jpg':        f'{IMG_DIR}/image_p45_133.jpeg',
    'michelangelo.jpg':     f'{IMG_DIR}/image_p46_136.jpeg',
    'raphael.jpg':          f'{IMG_DIR}/image_p47_139.jpeg',
    'lol_doll.jpg':         f'{IMG_DIR}/image_p48_142.jpeg',
    'lol_unicorn.jpg':      f'{IMG_DIR}/image_p49_145.jpeg',
    'rainbow_dash.jpg':     f'{IMG_DIR}/image_p55_164.jpeg',
    'princess_cadence.jpg': f'{IMG_DIR}/image_p56_167.jpeg',
    'ken.jpg':              f'{IMG_DIR}/image_p60_178.jpeg',
    'skye.jpg':             f'{IMG_DIR}/image_p72_215.jpeg',
    'circus_bunny.jpg':     f'{IMG_DIR}/image_p73_216.jpeg',
    'circus_artist1.jpg':   f'{IMG_DIR}/image_p74_219.jpeg',
    'circus_artist2.jpg':   f'{IMG_DIR}/image_p75_223.jpeg',
    'jester.jpg':           f'{IMG_DIR}/image_p76_225.jpeg',
    'pop_it.jpg':           f'{IMG_DIR}/image_p77_228.jpeg',
    'paleontologist.jpg':   f'{IMG_DIR}/image_p78_232.jpeg',
    'footballer.jpg':       f'{IMG_DIR}/image_p79_235.jpeg',
    'blogger_male.jpg':     f'{IMG_DIR}/image_p80_238.jpeg',
    'host.jpg':             f'{IMG_DIR}/image_p83_246.jpeg',
    'dragon.jpg':           f'{IMG_DIR}/image_p84_249.jpeg',
    'unicorn.jpg':          f'{IMG_DIR}/image_p85_254.jpeg',
    'pirate_girl.jpg':      f'{IMG_DIR}/image_p86_255.jpeg',
}

for name, path in animators.items():
    if os.path.exists(path):
        im = Image.open(path)
        if im.mode != 'RGB':
            im = im.convert('RGB')
        cropped_im = trim_white(im)
        out_path = os.path.join('public/animators/cropped', name)
        cropped_im.save(out_path, quality=95)
        print(f"✅ {name} ({cropped_im.size[0]}x{cropped_im.size[1]})")
    else:
        print(f"❌ Not found: {path}")

print(f"\nDone! Processed {len(animators)} remaining animators.")
