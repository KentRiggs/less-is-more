import React, { useState, useContext, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { UserContext } from './UserContext';
import * as Yup from 'yup';
import './index.css';

const Amend = () => {
  const { user } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    apology_text: '',
    password: ''  // Add password field to state
  });
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (user) {
      // Fetch the current user details once when the component mounts
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = () => {
    if (!user || !user.username) {
        console.error('No user logged in or username missing');
        setFetchError('No user information available. Please log in.');
        return;
    }
    fetch(`http://localhost:5555/user-details/${user.username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Could not fetch user details');
        }
        return response.json();
    })
    .then(data => {
        setUserDetails({ ...data, password: '' }); // Reset password field after fetching
        setFetchError('');
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        setFetchError('Failed to fetch details. Please try again.');
    });
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    apology_text: Yup.string().required('Apology text is required'),
    password: Yup.string().required('Password is required to verify your identity')
  });

  if (!user) {
    return <div>Please log in to edit your details.</div>;
  }

  return (
    <div className="amend-container">
      <h1 className="amend-title">Edit Your Details</h1>
      <p>Please enter your password at the bottom to confirm changes.</p>
      <Formik
        initialValues={userDetails}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          fetch(`http://localhost:5555/user-details/${user.username}`, { 
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Update failed.');
            }
            return response.json();
          })
          .then(() => {
            alert('Update successful!');
            resetForm(); // Reset the form to initial values after successful submission
            setUserDetails({
              username: '',
              email: '',
              apology_text: '',
              password: ''  // Clear all fields including the password
            });
          })
          .catch(error => {
            console.error('Update Error:', error);
            alert(error.message);
            setFetchError('Failed to update. Please try again.');
          })
          .finally(() => {
            setSubmitting(false);
          });
        }}
        
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="username" type="text" className="amend-input" />
            <Field name="email" type="email" className="amend-input" />
            <Field name="apology_text" component="textarea" className="amend-textarea" />
            <Field name="password" type="password" placeholder="Enter your password to confirm changes" className="amend-input" />
            <button type="submit" className="amend-button" disabled={isSubmitting}>
              Save Changes
            </button>
          </Form>
        )}
      </Formik>
      {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
    </div>
  );
};

export default Amend;
