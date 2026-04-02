from flask import Blueprint,jsonify,request
from flask_jwt_extended import jwt_required,get_jwt_identity
from models.models import db, UserPlant
from datetime import datetime

import PIL.Image
from google import genai
import os 

plants_bp = Blueprint('plants',__name__,url_prefix="/api/plants")

@plants_bp.route("/",methods=["GET"])
@jwt_required()
def get_plants():
    user_id = int(get_jwt_identity())

    users_plants = UserPlant.query.filter_by(user_id=user_id).all()

    plant_list = []
    for plant in users_plants:
        plant_list.append({
            "id": plant.id,
            "nickname": plant.nickname,
            "api_plant_id": plant.api_plant_id,
            "folder_id": plant.folder_id,
            "last_watered": plant.last_watered.isoformat() if plant.last_watered else None
        })
        
    return jsonify({"status": "success", "data": plant_list}), 200

@plants_bp.route("/<int:folder_id>",methods=["GET"])
@jwt_required()
def get_plants_byFolder(folder_id):
    user_id = int(get_jwt_identity())

    users_plants = UserPlant.query.filter_by(user_id=user_id,folder_id=folder_id).all()

    plant_list = []
    for plant in users_plants:
        plant_list.append({
            "id": plant.id,
            "nickname": plant.nickname,
            "api_plant_id": plant.api_plant_id,
            "folder_id": plant.folder_id,
            "last_watered": plant.last_watered.isoformat() if plant.last_watered else None
        })
        
    return jsonify({"status": "success", "data": plant_list}), 200

@plants_bp.route("/",methods=['POST'])
@jwt_required()
def add_plant():
    data=request.get_json()

    user_id = int(get_jwt_identity())
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


@plants_bp.route("/<int:plant_id>",methods=['PUT'])
@jwt_required()
def update_plant(plant_id):
    user_id = int(get_jwt_identity())
    plant = db.session.get(UserPlant,plant_id)

    if not plant:
        return jsonify({"error": "The plant does not exist!"}), 404

    if plant.user_id != user_id:
        return jsonify({"error":"You aren't authorized to delete that plant!"})
    
    data = request.get_json()

    if 'nickname' in data:
        plant.nickname = data['nickname']

    if 'last_watered' in data:
        try:
            date_string = data['last_watered'].replace('Z', '+00:00')
            plant.last_watered = datetime.fromisoformat(date_string)
        except ValueError:
            return jsonify({"error": "Invalid format"}), 400
        
    try:
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"The plant was updated succesfully!",
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error updating the plant: {str(e)}"}), 500   
    

@plants_bp.route("/<int:plant_id>",methods=['DELETE'])
@jwt_required()
def delete_folder(plant_id):
    user_id = int(get_jwt_identity())
    plant = db.session.get(UserPlant,plant_id)

    if plant.user_id != user_id:
        return jsonify({"error":"You aren't authorized to delete that plant!"})
        
    try:
        db.session.delete(plant)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"The plant was deleted succesfully!",
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error deleting a plant: {str(e)}"}), 500
    

@plants_bp.route('/identify', methods=['POST'])
@jwt_required()
def identify_plant():
    if 'image' not in request.files:
        return jsonify({"error": "No image sent!"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No image selected!"}), 400

    try:
        img = PIL.Image.open(file.stream)
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return jsonify({"error": "API Key is missing!"}), 500
            
        client = genai.Client(api_key=api_key)
        
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=[
                "Give me the scientific name of that plant and only that, without any aditional text.",
                img
            ]
        )
        
        scientific_name = response.text.strip()
        
        return jsonify({
            "status": "success",
            "scientific_name": scientific_name
        }), 200

    except Exception as e:
        return jsonify({"error": f"Error processing the image: {str(e)}"}), 500