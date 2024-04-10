import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import './index.css'; // Ensure this is the correct path to your CSS file

const Amend = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    apology_text: '',
  });
  const [originalUsername, setOriginalUsername] = useState('');
  const [fetchError, setFetchError] = useState('');

  const fetchUserDetails = (username) => {
    const encodedUsername = encodeURIComponent(username);
    fetch(`http://localhost:5555/user-details/${encodedUsername}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not fetch user details');
        }
        return response.json();
      })
      .then(data => {
        setUserDetails(data);
        setOriginalUsername(username); 
        setFetchError('');
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        setFetchError('Failed to fetch details. Please check the username and try again.');
      });
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    apology_text: Yup.string().required('Apology text is required'),
  });

  return (
    <div className="amend-container">
      <h1 className="amend-title">Edit Your Details</h1>
      <Formik
        initialValues={{ username: '' }}
        validationSchema={Yup.object({
          username: Yup.string().required('Username is required to fetch details'),
        })}
        onSubmit={({ username }, { setSubmitting }) => {
          fetchUserDetails(username);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="username" type="text" placeholder="Enter username to fetch" className="amend-input" />
            <button type="submit" className="amend-button" disabled={isSubmitting}>
              Fetch Details
            </button>
          </Form>
        )}
      </Formik>
      {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
      {userDetails.username && (
        <Formik
          initialValues={userDetails}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            fetch(`http://localhost:5555/user-details/${encodeURIComponent(originalUsername)}`, { 
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
            })
            .catch(error => {
              console.error('Update Error:', error);
              alert('Failed to update. Please try again.');
            })
            .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="username" type="text" className="amend-input" />
              <Field name="email" type="email" className="amend-input" />
              <Field name="apology_text" component="textarea" className="amend-textarea" />
              <button type="submit" className="amend-button" disabled={isSubmitting}>
                Save Changes
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Amend;
