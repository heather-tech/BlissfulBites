from config import db


# ASSOCIATION TABLE - many to many between recipe & cuisine
recipe_cusine = db.Table(
    'recipe_cuisine',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipes.id'), primary_key=True),
    db.Column('cuisine_id', db.Integer, db.ForeignKey('cuisines.id'), primary_key=True),
)
