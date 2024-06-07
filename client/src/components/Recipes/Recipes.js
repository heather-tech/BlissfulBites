import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import EditRecipeForm from './EditRecipeForm';
import './recipe.css'
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecipes, deleteRecipe } from '../../reducers/recipesSlice';

function Recipes() {
  const dispatch = useDispatch();
  const recipes = useSelector(state => state.recipes.recipes);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  const displayRecipes = location.pathname === '/' ? recipes.slice(0, 3) : recipes;

  const handleEditRecipe = (recipeId) => {
    setEditingRecipeId(recipeId);
  };

  const updateRecipe = async (updatedRecipe) => {
    // Assume this action is already defined in your slice
    dispatch(updateRecipe(updatedRecipe));
  };

  return (
    <div className='recipes-home'>
      {location.pathname !== '/' && <h1>Recipes</h1>}
      <div className="recipes-container">
        <div className="recipes">
          {displayRecipes.map(recipe => (
            <React.Fragment key={recipe.id}>
              {editingRecipeId === recipe.id ? (
                <EditRecipeForm 
                  recipe={recipe} 
                  onCancel={() => setEditingRecipeId(null)}
                  updateRecipe={updateRecipe}
                />
              ) : (
                <RecipeCard
                  id={recipe.id}
                  name={recipe.name}
                  description={recipe.description}
                  image={recipe.image}
                  total_servings={recipe.total_servings}
                  prep_time={recipe.prep_time}
                  ingredients={recipe.ingredients}
                  directions={recipe.directions}
                  cuisineId={recipe.cuisine_id}
                  onDelete={() => dispatch(deleteRecipe(recipe.id))}
                  onEdit={() => handleEditRecipe(recipe.id)}
                  updatedRecipe={recipe} 
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recipes;
