import os
import requests
from flask import Blueprint,jsonify,request

perenual_bp = Blueprint('perenual',__name__,url_prefix="/api/perenual")

PERENUAL_BASE_URL = "https://perenual.com/api/v2"
api_key=os.getenv("PERENUAL_PLANT_API_KEY")

@perenual_bp.route("/",methods=['GET'])
def get_all_plants():
    page = request.args.get('page',1)
    search_query = request.args.get('q','')

    api_params = {"key":api_key,"page":page}

    if search_query:
        api_params["q"]=search_query

    try:
        response = requests.get(f"{PERENUAL_BASE_URL}/species-list",params=api_params)
        response.raise_for_status()

        data = response.json()

        return jsonify({
            "data":data["data"],
            "current_page":data['current_page'],
            "last_page": data['last_page']
        })
    except requests.exceptions.RequestException as e:
        return jsonify({
            "status": "error",
            "message": f"Error conecting to Perenual API: {str(e)}"
        }),502

@perenual_bp.route("/<int:plant_id>",methods=['GET'])
def get_plant_details(plant_id):
    try:
        response = requests.get(f"{PERENUAL_BASE_URL}/species/details/{plant_id}", params={"key":api_key})

        response.raise_for_status()
        data=response.json()

        return jsonify({"status": "success","data": data})
    except requests.exceptions.RequestException as e:
        return jsonify({
            "status": "error",
            "message": f"Error conecting to Perenual API: {str(e)}"
        }),502
    




