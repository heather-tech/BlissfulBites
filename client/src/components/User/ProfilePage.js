import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, updateUserProfile, logoutUser } from '../../reducers/usersSlice';
import './user.css'

function ProfilePage() {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleSaveProfile = (values) => {
    dispatch(updateUserProfile(values));
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
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
                  {/* <label>Name: </label> */}
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
          <div className="button-logout-container">
          <button className='button-logout' onClick={handleLogout}>Logout</button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ProfilePage;
