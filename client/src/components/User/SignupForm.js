import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signUpUser } from '../../reducers/usersSlice';
import './user.css'

const validationSchema = yup.object({
  email: yup.string()
    .email('Invalid email address')
    .required('Email required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password required'),
});

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
        const resultAction = await dispatch(signUpUser(values));
        if (signUpUser.fulfilled.match(resultAction)) {
          navigate('/user');
        } else {
           setError(resultAction.payload);
        }
      },
  });

  return (
    <div className="signupform">
      <div className="box">
        <form onSubmit={formik.handleSubmit}>
          <h2>Sign Up</h2>
          <div className="input-box">
            <input
              placeholder="Email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='error'>{formik.errors.email}</div>
            )}
          </div>
          <div className="input-box">
            <input
              placeholder="Password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='error'>{formik.errors.password}</div>
            )}
          </div>
          <button className="button" type="submit">Create Account</button>
          {error && <div className="error">{error}</div>}
          <p><a href="/login">Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
