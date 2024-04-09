import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Container, Form as BootstrapForm } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import * as Yup from 'yup';

const Amend = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    apology_text: '',
  });

  const [fetchError, setFetchError] = useState('');

  const fetchUserDetails = (username) => {
    // Encode the username to handle special characters in the URL path
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
        setFetchError('');
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        setFetchError('Failed to fetch details. Please check the username and try again.');
        // Adding console log to display error details clearly in the console
        console.log(`Failed to fetch details for username: ${username}. Error: ${error.message}`);
      });
  };
  

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    apology_text: Yup.string(), 
});


  return (
    <Container>
      <NavigationBar />
      <h1>Edit Your Details</h1>
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
            <BootstrapForm.Group controlId="fetchUsername">
              <BootstrapForm.Label>Enter Username</BootstrapForm.Label>
              <Field name="username" type="text" placeholder="Enter username to fetch" as={BootstrapForm.Control} />
              <Button variant="secondary" type="submit" disabled={isSubmitting}>
                Fetch Details
              </Button>
            </BootstrapForm.Group>
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
            fetch(`http://localhost:5555/user-details/${values.username}`, {
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
              <BootstrapForm.Group controlId="formUsername">
                <BootstrapForm.Label>Username</BootstrapForm.Label>
                <Field name="username" type="text" as={BootstrapForm.Control} />
              </BootstrapForm.Group>

              <BootstrapForm.Group controlId="formEmail">
                <BootstrapForm.Label>Email</BootstrapForm.Label>
                <Field name="email" type="email" as={BootstrapForm.Control} />
              </BootstrapForm.Group>

              <BootstrapForm.Group controlId="formApologyText">
                <BootstrapForm.Label>Apology Text</BootstrapForm.Label>
                <Field name="apology_text" as={BootstrapForm.Control} component="textarea" />
              </BootstrapForm.Group>

              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Save Changes
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default Amend;
