import json

images = [
    "image_p2_3.jpeg", "image_p2_4.jpeg", "image_p2_5.jpeg", "image_p2_6.jpeg",
    "image_p2_7.jpeg", "image_p2_8.jpeg", "image_p2_9.jpeg", "image_p2_10.jpeg",
    "image_p2_11.jpeg", "image_p2_12.jpeg", "image_p2_13.jpeg", "image_p2_14.jpeg",
    "image_p3_15.jpeg", "image_p3_16.jpeg", "image_p3_17.jpeg", "image_p3_18.jpeg",
    "image_p3_19.jpeg", "image_p3_20.jpeg", "image_p3_21.jpeg", "image_p3_22.jpeg",
    "image_p3_23.jpeg", "image_p3_24.jpeg", "image_p3_25.jpeg", "image_p3_26.jpeg",
    "image_p3_27.jpeg", "image_p3_28.jpeg"
]

cakes = []
for i, img in enumerate(images):
    cakes.append({
        "id": f"cake_{i+1}",
        "name": f"Торт {i+1}",
        "emoji": "🎂",
        "desc": "Авторский торт с неповторимым дизайном. Прекрасный вариант для вашего праздника!",
        "gradient": "from-white to-white",
        "image": f"/cakes/{img}",
        "price": "8 400 ₽"
    })

print("const CAKES = " + json.dumps(cakes, indent=2, ensure_ascii=False) + ";")
