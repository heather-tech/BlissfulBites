# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models.models import User, Cuisine, Recipe, db
from config import app, db

# SEEDS FOOD CATEGORIES
def seed_cuisines():
    # Deletes data first
    Cuisine.query.delete()
    # List of cuisines
    cuisines = ["American", "Chinese", "Italian", "Mexican", "Other"]

    # SEED CUISINES
    for cuisine in cuisines:
        # Checks if cuisine is already in database
        existing_cuisine = Cuisine.query.filter_by(name=cuisine).first()
        if existing_cuisine is None:
            # Add the cuisine to the database
            new_cuisine = Cuisine(name=cuisine)
            db.session.add(new_cuisine)
            db.session.commit()


# SEED USERS
def seed_users():
    User.query.delete()
    users = []

    user1 = User(email= 'fakeemail1@email.com',_password_hash='testpasstest')
    users.append(user1)

    user2 = User(email='fakeemail2@email.com', _password_hash='anothertest')
    users.append(user2)

    db.session.add_all(users)
    db.session.commit()


# SEEDS RECIPES
def seed_recipes():
    # deletes data first
    # Recipe.query.delete()

# Define a list of recipes with specific attributes
    recipes = [
        {
            "name": "Fluffy Chocolate Chip Pancakes",
            "description": "Fluffy chocolate chip pancakes with syrup.",
            "ingredients": "2 cups flour, 1 cup milk, 2 eggs, 1 tbsp sugar, 1 tbsp baking powder, chocolate chips",
            "directions": "Mix ingredients. Cook on greased skillet.",
            "total_servings": 10,
            "prep_time": 15, 
            "image": "https://t.ly/eGm9p",
            "cuisine": "American"
        },
        {
            "name": "Spaghetti",
            "description": "Rich and savory meat sauce over spaghetti.",
            "ingredients": "1 lb ground beef, 1 onion, 2 cloves garlic, 1 can tomato sauce, spaghetti noodles",
            "directions": "Cook beef with onion and garlic, then add tomato sauce. Serve over cooked spaghetti noodles.",
            "total_servings": 4, 
            "prep_time": 20, 
            "image": "https://workweeklunch.com/wp-content/uploads/2022/10/spaghetti.bolognese-3.jpg",
            "cuisine": "Italian"
        },
       
    ]
    
    # Fetch all cuisines from the database
    cuisines = {cuisine.name: cuisine for cuisine in Cuisine.query.all()}
    
    # Add the defined recipes to the database
    for recipe_data in recipes:
        # Find or create cuisine
        cuisine = Cuisine.query.filter_by(name=recipe_data["cuisine"]).first()
        if not cuisine:
            cuisine = Cuisine(name=recipe_data["cuisine"])
            db.session.add(cuisine)
            db.session.commit()

        # Add recipe
        new_recipe = Recipe(
            name=recipe_data["name"],
            description=recipe_data["description"],
            ingredients=recipe_data["ingredients"],
            directions=recipe_data["directions"],
            total_servings=recipe_data["total_servings"],
            prep_time=recipe_data["prep_time"],
            image=recipe_data["image"],
            cuisine_id=cuisine.id
        )
        db.session.add(new_recipe)
        db.session.commit()

# SEEDS ASSOCIATIONS TABLE
def seed_recipe_cuisines():
    # Sample data
    recipe_food_pairs = [
        ('Fluffy Chocolate Chip Pancakes', 'American'),
        ('Spaghetti', 'Italian')
    ]

    for recipe_name, cuisine_name in recipe_food_pairs:
        recipe = Recipe.query.filter_by(name=recipe_name).first()
        cuisine = Cuisine.query.filter_by(name=cuisine_name).first()

        # If all required are found
        if recipe and cuisine:
            recipe.cuisine_id = cuisine.id
            db.session.commit()


if __name__ == '__main__':
    with app.app_context():
        seed_cuisines()
        seed_recipes()
        seed_recipe_cuisines()
        seed_users()