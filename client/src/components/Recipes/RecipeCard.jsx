import React, { useState, useEffect } from 'react';

const RecipeCard = ({ id, name, description, image, total_servings, prep_time, ingredients, directions, cuisineId, onDelete, onEdit, updatedRecipe }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState('');
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedImage, setUpdatedImage] = useState(image);
  const [updatedTotalServings, setUpdatedTotalServings] = useState(total_servings);
  const [updatedPrepTime, setUpdatedPrepTime] = useState(prep_time);
  const [updatedIngredients, setUpdatedIngredients] = useState(ingredients);
  const [updatedDirections, setUpdatedDirections] = useState(directions);
  const [cuisineName, setCuisineName] = useState('');

  useEffect(() => {
    fetchCuisineName();
  }, [cuisineId, updatedRecipe]); // Update when cuisineId or updatedRecipe changes

  useEffect(() => {
    if (updatedRecipe && updatedRecipe.cuisine_id === cuisineId) {
      setCuisineName(updatedRecipe.cuisineName);
    }
  }, [updatedRecipe, cuisineId]);

  useEffect(() => { 
    if (updatedRecipe) {
      const {
        name: newName,
        description: newDescription,
        image: newImage,
        total_servings: newTotalServings,
        prep_time: newPrepTime,
        ingredients: newIngredients,
        directions: newDirections
      } = updatedRecipe;


      // Update only if it has changed
      if (newName !== updatedName) setUpdatedName(newName);
      if (newDescription !== updatedDescription) setUpdatedDescription(newDescription);
      if (newImage !== updatedImage) setUpdatedImage(newImage);
      if (newTotalServings !== updatedTotalServings) setUpdatedTotalServings(newTotalServings);
      if (newPrepTime !== updatedPrepTime) setUpdatedPrepTime(newPrepTime);
      if (newIngredients !== updatedIngredients) setUpdatedIngredients(newIngredients);
      if (newDirections !== updatedDirections) setUpdatedDirections(newDirections);
    }
  }, [updatedRecipe]);

  const fetchCuisineName = async () => {
    try {
      const response = await fetch(`/api/cuisines/${cuisineId}`);
      const data = await response.json();
      setCuisineName(data.name);
    } catch (error) {
      console.error('Error fetching cuisine name:', error);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleClose = () => {
    setExpanded(false);
  };

  const toggleIngredient = (index) => {
    const updatedIngredients = [...selectedIngredients];
    if (updatedIngredients.includes(index)) {
      updatedIngredients.splice(updatedIngredients.indexOf(index), 1);
    } else {
      updatedIngredients.push(index);
    }
    setSelectedIngredients(updatedIngredients);
  };

  return (
    <div className="recipe-card">
      <div className="recipe-header" onClick={toggleExpanded}>
        <h2 className="recipe-name">{name}</h2>
        <p className="recipe-description">{description}</p>
        <div className='tag'>
          <p className="cuisine-name">{cuisineName}</p>
        </div>
        <img alt={name} className="recipe-image" src={image} />
        <button className="see-recipe-button" onClick={handleClose}>
          {expanded ? 'Hide Recipe' : 'See Recipe'}
        </button>
        <button className="edit-recipe-button" onClick={() => onEdit(id)}>Edit</button>
        <button className="delete-recipe-button" onClick={onDelete}>Delete</button>
      </div>
      {expanded && (
        <div className="recipe-details">
          <div className="details">
            <div className="detail">
              <span>Total Servings:</span> {total_servings}
            </div>
            <div className="detail">
              <span>Prep Time:</span> {prep_time} min
            </div>
          </div>
          <div className="ingredients">
            <h3>Ingredients:</h3>
            <ul>
              {ingredients.split(',').map((ingredient, index) => (
                <li key={index} onClick={() => toggleIngredient(index)} className={selectedIngredients.includes(index) ? 'selected' : ''}>
                  {ingredient.trim()}
                </li>
              ))}
            </ul>
          </div>
          <div className="directions">
            <h3>Directions:</h3>
            <ol>
              {directions.split('.').map((direction, index) => {
                const trimmedDirection = direction.trim();
                if (trimmedDirection) {
                  return <li key={index}>{trimmedDirection}</li>;
                }
                return null;
              })}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
