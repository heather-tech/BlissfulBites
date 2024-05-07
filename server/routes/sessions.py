# PUT FRONTEND ROUTES IN 

import ipdb

from flask import request, session, make_response
from flask_restful import Resource
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from flask_login import LoginManager, login_user, logout_user, current_user
import traceback

from config import app, db, api
from models.models import User

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id == user_id).first()

class Signup(Resource):
    def post(self):
        data = request.get_json()

        try: 
            new_user = User(
                name = data.get('name'),
                email = data.get('email')
            )
            new_user.password_hash = data.get('password')
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            return make_response(new_user.to_dict(), 201)
        except Exception as e:
            traceback.print_exc()
            return {"error": "An error occurred while fetching the order history", "message": str(e)}, 500


class Login(Resource):
    def post(self):
        try: 
            data = request.get_json()
            user = User.query.filter_by(email = data.get('email')).first()
            password = request.get_json()['password']

            if user.authenticate(password):
                login_user(user, remember=True)
                return user.to_dict(), 200
            
            if not user:
                return{'Invalid Email/Password'}, 401
            
        except Exception as e:
            traceback.print_exc()
            return {"error": "An error occurred while fetching the order history", "message": str(e)}, 500

class AuthorizedSession(Resource):
    def get(self):
        try:
            if current_user.is_authenticated:
                user = current_user.to_dict()
                return make_response(user, 200)
        
        except:
            return make_response('Not Authorized', 401)


class Logout(Resource):
    def post(self):
        logout_user()
        return 'Goodbye!', 200


class CheckSession(Resource):
    def get(self):
        if current_user.is_authenticated:
            user = current_user.to_dict()
            return make_response(user, 200)
        else:
            return {"error": "Please log in"}, 401





api.add_resource(CheckSession, '/api/check_session')
api.add_resource(Signup, "/api/signup")
api.add_resource(Login, "/api/login")
api.add_resource(AuthorizedSession, '/authorized')
api.add_resource(Logout, '/api/logout')

