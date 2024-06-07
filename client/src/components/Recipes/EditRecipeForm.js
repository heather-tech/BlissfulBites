import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateRecipe } from '../../reducers/recipesSlice'

const EditRecipeForm = ({ recipe, onCancel }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ ...recipe });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { name, description, ingredients, directions, total_servings, prep_time, image } = formData;
    const errors = {};

    if (!name) errors.name = 'Name is required';
    if (!description) errors.description = 'Description is required';
    if (!ingredients) errors.ingredients = 'Ingredients is required';
    if (!directions) errors.directions = 'Directions is required';
    if (!total_servings) errors.total_servings = 'Total Servings is required';
    if (!prep_time) errors.prep_time = 'Prep Time is required';
    if (!image) errors.image = 'Image is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(updateRecipe(formData)).unwrap();
      onCancel(); // CLOSES EDIT FORM
    } catch (error) {
      console.error('Update error:', error);
      setError('Update failed');
    }
  };

  return (
    <div className="edit-recipe-form">
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <label>Name:</label>
          <input
            placeholder="Name"
            name="name"
            type="text"
            onChange={handleChange}
            value={formData.name}
          />
          {errors.name && <div className='error'>{errors.name}</div>}
        </div>
        <div className="input-box">
        <label>Description:</label>
          <textarea
            placeholder="Description"
            name="description"
            type="text"
            onChange={handleChange}
            value={formData.description}
          />
          {errors.description && <div className='error'>{errors.description}</div>}
        </div>
        <div className="input-box">
        <label>Ingredients:</label>
          <textarea
            placeholder="Ingredients"
            name="ingredients"
            type="text"
            onChange={handleChange}
            value={formData.ingredients}
          />
          {errors.ingredients && <div className='error'>{errors.ingredients}</div>}
        </div>
        <div className="input-box">
        <label>Directions:</label>
          <textarea
            placeholder="Directions"
            name="directions"
            type="text"
            onChange={handleChange}
            value={formData.directions}
          />
          {errors.directions && <div className='error'>{errors.directions}</div>}
        </div>
        <div className="input-box">
        <label>Total Servings:</label>
          <input
            placeholder="Total Servings"
            name="total_servings"
            type="number"
            onChange={handleChange}
            value={formData.total_servings}
          />
          {errors.total_servings && <div className='error'>{errors.total_servings}</div>}
        </div>
        <div className="input-box">
        <label>Prep Time:</label>
          <input
            placeholder="Prep Time"
            name="prep_time"
            type="number"
            onChange={handleChange}
            value={formData.prep_time}
          />
          {errors.prep_time && <div className='error'>{errors.prep_time}</div>}
        </div>
        <div className="input-box">
        <label>Image Link:</label>
          <input
            placeholder="Image"
            name="image"
            type="text"
            onChange={handleChange}
            value={formData.image}
          />
          {errors.image && <div className='error'>{errors.image}</div>}
        </div>
        <button className="button" type="submit">Save</button>
        <button className="button" type="button" onClick={onCancel}>Cancel</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default EditRecipeForm;
