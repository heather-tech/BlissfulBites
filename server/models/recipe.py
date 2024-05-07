from sqlalchemy_serializer import SerializerMixin
from config import db
from .recipe_cuisine import *
from .cuisine import *


class Recipe(db.Model, SerializerMixin):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    directions = db.Column(db.Text, nullable=False)
    total_servings = db.Column(db.Integer, nullable=False) 
    prep_time = db.Column(db.Integer, nullable=False) 
    image = db.Column(db.String, nullable=True)
    cuisine_id = db.Column(db.Integer, db.ForeignKey('cuisines.id'), nullable=True)    

    # FOREIGN KEYS
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    cuisine = db.relationship('Cuisine', back_populates='recipes', foreign_keys=[cuisine_id])

    
    # RELATIONSHIPS
    user = db.relationship('User', back_populates='recipes')
    cuisines = db.relationship('Cuisine', secondary='recipe_cuisine', back_populates='recipes')

    # SERIALIZATION
    serialize_rules = ( '-user', '-cuisines', '-cuisine')

    def __repr__(self):
        return f"<Recipe {self.name}>"