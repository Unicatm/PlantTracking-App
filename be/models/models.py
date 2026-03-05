from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__='users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120),unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    folders = db.relationship('Folder',backref='owner',lazy=True)
    plants = db.relationship('UserPlant',backref='owner',lazy=True)

class Folder(db.Model):
    __tablename__='folders'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    user_id = db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)

    plants = db.relationship('UserPlant',backref='folder',lazy=True)

class UserPlant(db.Model):
    __tablename__='user_plants'

    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(100), nullable=False)
    api_plant_id = db.Column(db.Integer, nullable=False)
    last_watered = db.Column(db.DateTime, default=datetime.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    folder_id = db.Column(db.Integer, db.ForeignKey('folders.id'), nullable=True)

