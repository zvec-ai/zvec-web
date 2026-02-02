import base64
import json
from io import BytesIO

import matplotlib.pyplot as plt
from PIL import Image


def load_jsonl(file_path: str) -> list[dict]:
    with open(file_path, "r", encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


def display_image_from_base64(base64_string: str):
    # Remove the data URI prefix if present
    if base64_string.startswith("data:image"):
        # Extract the actual base64 data
        base64_data = base64_string.split(",")[1]
    else:
        base64_data = base64_string

    # Decode the base64 string
    image_data = base64.b64decode(base64_data)

    # Create a BytesIO object from the decoded data
    image_buffer = BytesIO(image_data)

    # Open the image using Pillow
    image = Image.open(image_buffer)

    # For Jupyter notebooks, use matplotlib to display the image inline
    plt.imshow(image)
    plt.axis("off")  # Hide axes
    plt.show()
    plt.show()
