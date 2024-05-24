# Standard library imports
# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource
import traceback

# Local imports
from config import app, db, api

# model imports
from models.models import User


# USERS ROUTES - POST, GET, PUT, DELETE
class Users(Resource):
    def post(self):
        form_data = request.json
        new_user = User(
            email=form_data['email']
        )
        new_user.password_hash = form_data['password']
        db.session.add(new_user)
        db.session.commit()
        response = make_response(new_user.to_dict(), 201)
        return response

    def get(self, user_id):
        user = User.query.get(user_id)
        # user = User.query.filter(User.id == id).first()
        if not user:
            return {'error': 'User not found'}, 404
        return user.to_dict()

    def put(self, user_id):
        form_data = request.json
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        
        # Updates user's email, name & bio
        if 'email' in form_data:
            user.email = form_data['email']
        if 'name' in form_data:
            user.name = form_data['name']
        if 'bio' in form_data:
            user.bio = form_data['bio']

        try:
            db.session.commit()
            return user.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update user profile'}, 500
        
    def patch(self, user_id):
        form_data = request.json
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        
        # Updates user's email, name & bio
        if 'email' in form_data:
            user.email = form_data['email']
        if 'name' in form_data:
            user.name = form_data['name']
        if 'bio' in form_data:
            user.bio = form_data['bio']

        try:
            db.session.commit()
            return user.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update user profile'}, 500

    def delete(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        db.session.delete(user)
        db.session.commit()
        response = make_response(user.to_dict(), 204)
        return response
    
# CURRENT USERS INFO-GET, PATCH, DELETE       
class CurrentUser(Resource):
    def get(self, id):
        try: 
            user_info = User.query.filter_by(id=id).first()
            if not user_info:
                return {"error": "User not found"}, 404
            return jsonify(user_info.to_dict(), 200)
        except Exception as e:
            traceback.print_exc()
            return {"error": "An error occurred while fetching the user information", "message": str(e)}, 500
    
    def patch(self, id):
        data = request.get_json()
        try: 
            user_info = User.query.filter_by(id=id).first()
            if user_info:
                for attr in data:
                    setattr(user_info, attr, data.get(attr))
                    
                db.session.add(user_info)
                db.session.commit()
                return make_response(user_info.to_dict(), 200)
            else:
                return {"Validation error"}, 400
            # return {"User not found"}, 404
        except Exception as e:
            traceback.print_exc()
            return {"error": "An error occurred while fetching the order history", "message": str(e)}, 500
    
    def delete(self, id):
        try: 
            user = User.query.filter_by(id=id).first()
            if user:
                db.session.delete(user)
                db.session.commit()
                return make_response({}, 204)
            return {"User not found"}, 404
        except Exception as e:
            traceback.print_exc()
            return {"error": "An error occurred while fetching the order history", "message": str(e)}, 500


api.add_resource(CurrentUser, '/api/current_user/<int:id>')

api.add_resource(Users, '/api/users', '/api/users/<int:user_id>')


