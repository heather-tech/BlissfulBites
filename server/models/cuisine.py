from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db
from .recipe_cuisine import *

class Cuisine(db.Model, SerializerMixin):
    __tablename__ = 'cuisines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    # RELATIONSHIPS
    recipes = db.relationship('Recipe', secondary='recipe_cuisine', back_populates='cuisines')
    cuisine_recipes = db.relationship('Recipe', back_populates='cuisine', foreign_keys='Recipe.cuisine_id')

    # SERIALIZATION
    # serialize_rules = ('-id', )  

    # VALIDATION
    @validates('name')
    def validate(self, key, value):
        if not value:
            raise ValueError(f"{key} cannot be empty.")
        return value

    def __repr__(self):
        return f'<Cuisine {self.cuisine}>'