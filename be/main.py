from google import genai
import PIL.Image
import os 
from dotenv import load_dotenv, dotenv_values

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

img_path = "./be/liliac.png"
img = PIL.Image.open(img_path)

response = client.models.generate_content(
    model="gemini-2.5-flash", 
    contents=[
        "Give me the scientific name of that plant and only that, without any aditional text.",
        img
    ]
)

print(response.text)

