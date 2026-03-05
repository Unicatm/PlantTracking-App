from flask import Blueprint,jsonify,request
from models.models import db, UserPlant

plants_bp = Blueprint('plants',__name__,url_prefix="/api/plants")

@plants_bp.route("/",methods=['POST'])
def add_plant():
    data=request.get_json()

    user_id = data.get('user_id',1)
    api_plant_id = data.get('api_plant_id')
    nickname = data.get('nickname')
    folder_id = data.get('folder_id',None)

    try:
        new_plant = UserPlant(user_id=user_id,api_plant_id=api_plant_id,nickname=nickname,folder_id=folder_id)

        db.session.add(new_plant)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"{nickname} was added into your collection!",
            "plant_id": new_plant.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error at saving the plant: {str(e)}"}), 500