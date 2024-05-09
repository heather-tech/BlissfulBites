import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Formik } from 'formik';
import './user.css'

function ProfilePage({onLogout}) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/check_session');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Failed to fetch current user');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleSaveProfile = async (values) => {
    try {
      const response = await fetch(`/api/current_user/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (response.ok) {
        setUser(null);
        onLogout();
        // HOME PAGE AFTER LOGGING OUT
        navigate('/'); 
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className='profilepage'>
    <h1>Hello {user ? user.name : ''}!</h1>
      {user ? (
        <>
          <Formik
            initialValues={{
              name: user.name || '',
              bio: user.bio || '',
            }}
            onSubmit={(values, actions) => {
              handleSaveProfile(values);
              actions.setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <form className="box" onSubmit={handleSubmit}>
                <p className='profile-email'>Email: {user.email}</p>
                <div className='input-box'>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
                <div className='input-box'>
                  <input
                    type="text"
                    id="bio"
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                    placeholder="Enter your bio"
                  />
                </div>
                <button className="button" type="submit" disabled={isSubmitting}>
                  Save
                </button>
              </form>
            )}
          </Formik>
          <button className='button' onClick={handleLogout}>Logout</button>
        </>
      ) : null}
    </div>
  );
}

export default ProfilePage;
