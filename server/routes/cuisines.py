from flask_restful import Resource
from flask import request, make_response, jsonify

from config import db, api, app

from models.models import Cuisine


# Cuisine ROUTES - POST, GET
class CuisineResource(Resource):
    def post(self):
        form_data = request.json
        new_cuisine = Cuisine(
            name=form_data['name']
        )
        db.session.add(new_cuisine)
        db.session.commit()
        response = make_response(new_cuisine.to_dict(), 201)
        return response
    
    def get(self, cuisine_id=None):
        if cuisine_id:
            cuisine = Cuisine.query.get(cuisine_id)
            if not cuisine:
                return {'error': 'Cuisine not found'}, 404
            return cuisine.to_dict()
        else:
            cuisines = Cuisine.query.all()
            cuisine_dicts = [cuisine.to_dict() for cuisine in cuisines]
            return jsonify(cuisine_dicts)

    # def get(self, cuisine_id):
    #     cuisine = Cuisine.query.get(cuisine_id)
    #     if not cuisine:
    #         return {'error': 'Cuisine not found'}, 404
    #     return cuisine.to_dict()
    
api.add_resource(CuisineResource, '/api/cuisines', '/api/cuisines/<int:cuisine_id>')
