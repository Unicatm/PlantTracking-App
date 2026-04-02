from flask import Blueprint,jsonify,request
from flask_jwt_extended import jwt_required,get_jwt_identity
from models.models import db, Folder

folders_bp = Blueprint('folders',__name__,url_prefix="/api/folders")

@folders_bp.route("/",methods=['GET'])
@jwt_required()
def get_folders():
    user_id = int(get_jwt_identity())

    try:
        user_folders = Folder.query.filter_by(user_id=user_id).all()

        folder_list = []
        for folder in user_folders:
            folder_list.append({
                "id": folder.id,
                "name": folder.name,
        })

        return jsonify({"status": "success", "data": folder_list}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error displaing folders for a user: {str(e)}"}), 500

@folders_bp.route("/",methods=['POST'])
@jwt_required()
def add_folder():
    data=request.get_json()

    user_id = int(get_jwt_identity())
    name = data.get('name')

    try:
        new_folder = Folder(name=name,user_id=user_id)

        db.session.add(new_folder)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"A new folder was created!",
            "plant_id": new_folder.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error creating a folder: {str(e)}"}), 500
    
@folders_bp.route('/<int:folder_id>', methods=['PUT'])
@jwt_required()
def update_folder(folder_id):
    user_id = int(get_jwt_identity())
    folder = db.session.get(Folder, folder_id)

    if not folder:
        return jsonify({"error": "The folder wasn't found!"}), 404

    if folder.user_id != user_id:
        return jsonify({"error":"You aren't authorized to delete that plant!"})

    data = request.get_json()
    
    if 'name' in data:
        folder.name = data['name']

    try:
        db.session.commit()
        return jsonify({
            "status": "success", 
            "message": "Folder name was updated!"
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
    
@folders_bp.route("/<int:folder_id>",methods=['DELETE'])
@jwt_required()
def delete_folder(folder_id):
    user_id = int(get_jwt_identity())
    folder = db.session.get(Folder,folder_id)

    if folder.user_id != user_id:
        return jsonify({"error":"You aren't authorized to delete that folder!"})
        
    try:
        db.session.delete(folder)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"The folder was deleted succesfully!",
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error deleting a folder: {str(e)}"}), 500