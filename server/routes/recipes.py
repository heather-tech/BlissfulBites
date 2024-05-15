# Standard library imports
# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource
from werkzeug.exceptions import NotFound
from flask_login import login_required, current_user


# Local imports
from config import app, db, api

# model imports
from models.models import Recipe


# RECIPES ROUTES - GET, POST, PUT, DELETE
class RecipesResource(Resource):
    @login_required
    def post(self):
        form_data = request.json
        new_recipe = Recipe(
            name=form_data['name'],
            description=form_data['description'],
            ingredients=form_data['ingredients'],
            directions=form_data['directions'],
            total_servings=form_data['total_servings'],
            prep_time=form_data['prep_time'],
            image=form_data['image'],
            cuisine_id=form_data['cuisine_id'],
            user_id=current_user.id
        )
        db.session.add(new_recipe)
        db.session.commit()
        response = make_response(new_recipe.to_dict(), 201)
        return response
    
    def get(self, recipe_id=None):  
        if recipe_id:
            recipe = Recipe.query.get(recipe_id)
            if not recipe:
                return {'error': 'Recipe not found'}, 404
            return recipe.to_dict()
        else:  # If no recipe_id is provided, return all recipes
            recipes = Recipe.query.all()
            recipe_dicts = [recipe.to_dict() for recipe in recipes]
            return jsonify(recipe_dicts)

    def put(self, recipe_id):
        form_data = request.json
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return {'error': 'Recipe not found'}, 404
        
        # Update recipe attributes w/ provided form data
        recipe.name = form_data.get('name', recipe.name)
        recipe.description = form_data.get('description', recipe.description)
        recipe.ingredients = form_data.get('ingredients', recipe.ingredients)
        recipe.directions = form_data.get('directions', recipe.directions)
        recipe.total_servings = form_data.get('total_servings', recipe.total_servings)
        recipe.prep_time = form_data.get('prep_time', recipe.prep_time)
        recipe.image = form_data.get('image', recipe.image)

        db.session.commit()
        response = make_response(recipe.to_dict(), 200)
        return response

    def delete(self, recipe_id):
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return {'error': 'Recipe not found'}, 404
        db.session.delete(recipe)
        db.session.commit()

        # Fetch remaining recipes
        remaining_recipes = Recipe.query.all()

        # Update the IDs
        for index, remaining_recipe in enumerate(remaining_recipes, start=1):
            remaining_recipe.id = index

        db.session.commit()

        response = make_response(recipe.to_dict(), 204)
        return response

    
    

api.add_resource(RecipesResource, '/api/recipes', '/api/recipes/<int:recipe_id>')
    



