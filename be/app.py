import os
from flask import Flask
from dotenv import load_dotenv

load_dotenv()

from routes.perenual_api import perenual_bp

app = Flask(__name__)
app.register_blueprint(perenual_bp)

@app.route('/')
def index():
    return "Mergeee!"

if __name__ == "__main__":
    app.run(debug=True)