from flask import Blueprint,jsonify,request
from flask_jwt_extended import jwt_required,get_jwt_identity
from models.models import db, User

user_bp = Blueprint('user',__name__,url_prefix="/api/user")

@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_profile():
    current_user_id = int(get_jwt_identity())
    
    user = db.session.get(User, current_user_id)
    
    if not user:
        return jsonify({"error": "User not found!"}), 404
        
    return jsonify({
        "status": "success",
        "data": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200