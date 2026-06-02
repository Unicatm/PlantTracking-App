from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__='users'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120),unique=True, nullable=False)
    password_hash = db.Column(db.String(250), nullable=False)

    folders = db.relationship('Folder',backref='owner',lazy=True)
    plants = db.relationship('UserPlant',backref='owner',lazy=True)

class Folder(db.Model):
    __tablename__='folders'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.String(50), nullable=False)

    user_id = db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)

    plants = db.relationship('UserPlant',backref='folder',lazy=True,cascade="all, delete-orphan")

class UserPlant(db.Model):
    __tablename__='user_plants'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    nickname = db.Column(db.String(100), nullable=False)
    api_plant_id = db.Column(db.Integer, nullable=False)
    last_watered = db.Column(db.DateTime, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    folder_id = db.Column(db.Integer, db.ForeignKey('folders.id'), nullable=True)

    watering_history = db.relationship(
        'PlantWateringHistory',
        backref='plant',
        lazy=True,
        cascade="all, delete-orphan"
    )

class PlantWateringHistory(db.Model):
    __tablename__='plant_watering_history'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    watered_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    plant_id = db.Column(db.Integer, db.ForeignKey('user_plants.id'), nullable=False)

