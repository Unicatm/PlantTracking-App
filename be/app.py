import os
from flask import Flask
from dotenv import load_dotenv
from models.models import db

load_dotenv()

db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_host = os.getenv('DB_HOST')
db_name = os.getenv('DB_NAME')

from routes.perenual_api import perenual_bp
from routes.plants import plants_bp

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}"
db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(perenual_bp)
app.register_blueprint(plants_bp)

@app.route('/')
def index():
    return "Mergeee!"

if __name__ == "__main__":
    app.run(debug=True)