import os
from flask import Flask
from dotenv import load_dotenv
from models.models import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS

load_dotenv()
jwt=JWTManager()

from routes.perenual_api import perenual_bp
from routes.plants import plants_bp
from routes.folders import folders_bp
from routes.auth import auth_bp
from routes.users import user_bp

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default-jwt-secret')

db.init_app(app)
jwt.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(perenual_bp)
app.register_blueprint(plants_bp)
app.register_blueprint(folders_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)

@app.route('/')
def index():
    return "Mergeee!"

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)