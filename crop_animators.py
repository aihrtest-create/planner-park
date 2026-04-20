import os
from PIL import Image, ImageChops

def trim_white(im):
    """Trim white/near-white borders from an image."""
    bg = Image.new(im.mode, im.size, im.getpixel((0, 0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

os.makedirs('public/animators/cropped', exist_ok=True)

IMG_DIR = 'processed_pdfs/Каталог с Аниматорами small страницы/images'

# Map: output filename -> source image (largest image per page = the character photo)
animators = {
    # 👑 Принцессы
    'elsa.jpg':             f'{IMG_DIR}/image_p2_4.jpeg',
    'ariel.jpg':            f'{IMG_DIR}/image_p6_16.jpeg',
    'rapunzel.jpg':         f'{IMG_DIR}/image_p10_28.jpeg',
    'moana.jpg':            f'{IMG_DIR}/image_p11_30.jpeg',
    'minnie_mouse.jpg':     f'{IMG_DIR}/image_p14_40.jpeg',
    'barbie.jpg':           f'{IMG_DIR}/image_p59_176.jpeg',
    'lol_queen_bee.jpg':    f'{IMG_DIR}/image_p50_148.jpeg',

    # 🦸 Супергерои
    'spiderman.jpg':        f'{IMG_DIR}/image_p19_55.jpeg',
    'batman.jpg':           f'{IMG_DIR}/image_p17_48.jpeg',
    'captain_america.jpg':  f'{IMG_DIR}/image_p21_61.jpeg',
    'superman.jpg':         f'{IMG_DIR}/image_p22_64.jpeg',
    'deadpool.jpg':         f'{IMG_DIR}/image_p18_52.jpeg',
    'optimus_prime.jpg':    f'{IMG_DIR}/image_p67_199.jpeg',

    # 🖤 Антигерои
    'wednesday.jpg':        f'{IMG_DIR}/image_p44_130.jpeg',
    'maleficent.jpg':       f'{IMG_DIR}/image_p16_46.jpeg',
    'cruella.jpg':          f'{IMG_DIR}/image_p15_43.jpeg',
    'huggy_wuggy.jpg':      f'{IMG_DIR}/image_p37_108.jpeg',
    'darth_vader.jpg':      f'{IMG_DIR}/image_p62_184.jpeg',

    # 🎬 Мультики
    'chase.jpg':            f'{IMG_DIR}/image_p71_211.jpeg',
    'kuromi.jpg':           f'{IMG_DIR}/image_p52_154.jpeg',
    'hello_kitty.jpg':      f'{IMG_DIR}/image_p53_157.jpeg',
    'naruto.jpg':           f'{IMG_DIR}/image_p66_197.jpeg',
    'pikachu.jpg':          f'{IMG_DIR}/image_p69_206.jpeg',
    'alice.jpg':            f'{IMG_DIR}/image_p58_172.jpeg',

    # 🎮 Игры
    'minecraft_creeper.jpg': f'{IMG_DIR}/image_p24_69.jpeg',
    'brawl_leon.jpg':       f'{IMG_DIR}/image_p33_96.jpeg',
    'sonic.jpg':            f'{IMG_DIR}/image_p39_114.jpeg',
    'mario.jpg':            f'{IMG_DIR}/image_p38_112.jpeg',

    # 🌟 Другие
    'harry_potter.jpg':     f'{IMG_DIR}/image_p40_117.jpeg',
    'blogger.jpg':          f'{IMG_DIR}/image_p81_241.jpeg',
    'pirate.jpg':           f'{IMG_DIR}/image_p87_258.jpeg',
    'squid_game.jpg':       f'{IMG_DIR}/image_p63_187.jpeg',
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

print(f"\nDone! Processed {len(animators)} animators.")
