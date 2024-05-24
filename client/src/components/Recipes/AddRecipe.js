import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddRecipe() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    directions: '',
    prep_time: '',
    total_servings: '',
    image: '',
    cuisine_id: '',
    user_id: '', 
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [otherCuisineName, setOtherCuisineName] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/check_session');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          // Set user_id in the form data
          setFormData(prevState => ({
            ...prevState,
            user_id: userData.id,
          }));
        } else {
          // Redirects to login page if not authenticated
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    fetchCuisines();
  }, []);

  const fetchCuisines = async () => {
    try {
      const response = await fetch('/api/cuisines');
      const data = await response.json();
      setCuisines(data);
    } catch (error) {
      console.error('Error fetching cuisines:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCuisineChange = (e) => {
    const value = e.target.value;
    setSelectedCuisine(value);
    // console.log(value)
  };

  const handleOtherCuisineNameChange = (e) => {
    setOtherCuisineName(e.target.value);
    console.log(e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let cuisineId;
    let cuisineName
    if (selectedCuisine === '5') {
      try {
        const response = await fetch('/api/cuisines', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: otherCuisineName }),
        });
        const data = await response.json();
        cuisineId = data.id;
        cuisineName = otherCuisineName;
      } catch (error) {
        console.error('Error creating new cuisine:', error);
      }
    } else {
      cuisineId = selectedCuisine;

      const selectedCuisineObj = cuisines.find(cuisine => cuisine.id === selectedCuisine);
      cuisineName = selectedCuisineObj ? selectedCuisineObj.name : '';
    }
    // Retrieves cuisine id
    formData.cuisine_id = cuisineId;

    setFormData({...formData, cuisine_id: cuisineId, cuisine_name: cuisineName});
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Recipe created:', data);
      setSuccessMessage(`${formData.name} added!`);
      setFormData({
        name: '',
        description: '',
        ingredients: '',
        directions: '',
        prep_time: '',
        total_servings: '',
        image: '',
        cuisine_id: '',
        user_id: '', 
      });
      navigate('/recipes')
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <div className="addrecipe">
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="addrecipe-card">
          {successMessage && <p>{successMessage}</p>}
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Recipe name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              placeholder="Brief recipe description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Ingredients:</label>
            <textarea
              name="ingredients"
              placeholder="Recipe ingredients separated by commas"
              value={formData.ingredients}
              onChange={handleInputChange}
              required
            />
            <label>Directions:</label>
            <textarea
              name="directions"
              placeholder="Recipe directions separated by periods."
              value={formData.directions}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Prep Time (minutes):</label>
            <input
              type="number"
              name="prep_time"
              placeholder="Approximate prep time"
              value={formData.prep_time}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Total Servings:</label>
            <input
              type="number"
              name="total_servings"
              placeholder="Total servings"
              value={formData.total_servings}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Image Link:</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Cuisine:</label>
            <select
              name="cuisine_id"
              value={selectedCuisine}
              onChange={handleCuisineChange}
              required
            >
              <option value="">Select cuisine...</option>
              {cuisines.map(cuisine => (
                <option key={cuisine.id} value={cuisine.id}>{cuisine.name}</option>
              ))}
              {/* Prevents duplicating of cuisines */}
              {!cuisines.some(cuisine => cuisine.name === 'Other') && (
                <option value="Other">Other</option>
              )}
            </select>
            {console.log(selectedCuisine)} 
            {selectedCuisine == "5" ? 

            <input
              id="other-cuisine-input"
              type="text"
              placeholder="Enter custom cuisine name"
              value={otherCuisineName}
              onChange={handleOtherCuisineNameChange}
              style={{ display: selectedCuisine === '5' ? 'block' : 'none' }}
            />:<div></div>
          }
          </div>
          <button className="button" type="submit">Add Recipe</button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;
