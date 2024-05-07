import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  email: yup.string()
    .email('Invalid email address')
    .required('Email required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password required'),
});

const SignupForm = ({onSignUpSuccess}) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        if (!response.ok) {
          const data = await response.json();
          if (response.status === 409 && data.error === 'Email already exists') {
            setError('Email is already registered');
          } else {
            throw new Error('Signup failed');
          }
        } else {
          onSignUpSuccess();
          const data = await response.json();
          setUser(data);
          navigate('/user');
        }
      } catch (error) {
        console.error('Signup error:', error);
        setError('Signup failed');
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
          <p><a href="/login">Sign In</a></p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
