import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Container, Form as BootstrapForm } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import * as Yup from 'yup';

const AmendPage = () => {
  const [initialValues, setInitialValues] = useState({
    username: '',
    email: '',
    apology_text: '',
  });

  useEffect(() => {
    // Fetch the user/apology details using the apology ID, if that's what's available
    const apologyId = sessionStorage.getItem('apology_id');
    if (!apologyId) {
      console.error("Apology ID not found in session storage");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5555/apology_details/${apologyId}`);
        if (response.ok) {
          const data = await response.json();
          setInitialValues({
            username: data.username,
            email: data.email,
            apology_text: data.apology_text, // assuming these details are available from the backend
          });
        } else {
          throw new Error('Failed to fetch details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    apology_text: Yup.string().required('Apology text is required'),
  });

  return (
    <Container>
      <NavigationBar />
      <h1>Edit Your Details</h1>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          const apologyId = sessionStorage.getItem('apology_id'); 
          fetch(`http://localhost:5555/update_apology/${apologyId}`, {  
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Update failed.');
            }
          })
          .then(data => {
            console.log('Updated data:', data);
            alert('Update successful!');
          })
          .catch(error => {
            console.error('Error:', error);
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
    </Container>
  );
};

export default AmendPage;
