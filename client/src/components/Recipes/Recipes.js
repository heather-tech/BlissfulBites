import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import EditRecipeForm from './EditRecipeForm';

function Recipes() {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  useEffect(() => {
    fetch('/api/recipes')
      .then(r => r.json())
      .then(data => {
        setRecipes(data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      });
  }, []);


  const deleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      } else {
        console.error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };


  const handleEditRecipe = (recipeId) => {
    setEditingRecipeId(recipeId); 
  };

  const updateRecipe = async (updatedRecipe) => {
    try {
      const response = await fetch(`/api/recipes/${updatedRecipe.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch updated recipe');
      }
      const data = await response.json();
      // Update the recipes array with the updated recipe
      setRecipes(prevRecipes => prevRecipes.map(recipe => (
        recipe.id === updatedRecipe.id ? data : recipe
      )));
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };
  


  // CHECK IF CURRENT LOCATION IS HOME ("/")
  const isHomePage = location.pathname === '/';

  return (
    <div className='recipes-home'>
      {!isHomePage && <h1>Recipes</h1>}

      <div className="recipes-container">
        <div className="recipes">
          {recipes.map(recipe => ( 
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
                  onDelete={() => deleteRecipe(recipe.id)}
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
