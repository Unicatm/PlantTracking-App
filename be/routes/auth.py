from flask import Blueprint,request,jsonify
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import create_access_token

from models.models import db,User

auth_bp = Blueprint('auth',__name__,url_prefix="/api/auth")

@auth_bp.route('/register',methods=['POST'])
def register():
    data = request.get_json()

    username=data.get('username')
    email=data.get('email')
    password=data.get('password')

    if not username or not email or not password:
        return jsonify({"error":"All fields must be completed!"})
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error":"This email is already used!"})
    if User.query.filter_by(username=username).first():
        return jsonify({"error":"This username is already used!"})
    
    hashed_pw = generate_password_hash(password)
    user = User(username=username,email=email,password_hash=hashed_pw)

    try:
        db.session.add(user)
        db.session.commit()

        return jsonify({
            "status": "success", 
            "message": "The account was created!"
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error creating the account: {str(e)}"}), 500
    
@auth_bp.route('/login',methods=['POST'])
def login():
    data=request.get_json()

    email=data.get('email')
    password=data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are mandatory!"}), 400
    
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "status": "success",
            "message": "Logged with success!",
            "access_token": access_token
        }), 200
    else:
        return jsonify({"error": "Ivalid email or password!"}), 401
    