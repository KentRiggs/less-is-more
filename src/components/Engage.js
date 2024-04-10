import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Container, Form as BootstrapForm } from 'react-bootstrap';
import * as Yup from 'yup';

const EngagePage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from your backend and set them in state
    fetch('http://localhost:5555/categories/')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
    recipient: Yup.string().required('Recipient is required'),
    event_date: Yup.date().required('Event date is required'),
    event_location: Yup.string().required('Event location is required'),
    category_id: Yup.string().required('You must select a category'),
  });

  return (
    <Container>
      <h1>Engage in Apology</h1>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          recipient: '',
          event_date: '',
          event_location: '',
          category_id: '', 
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          //Retrieve apology_id from session storage
          const apologyId = sessionStorage.getItem('apology_id');
          if (!apologyId) {
            alert("No apology ID found. Please start from the Home page.");
            setSubmitting(false);
            return;  // Prevent further action if no apology ID is available
          }

          //Append apology_id to the form values before submission
          values.apology_id = apologyId;

          fetch('http://localhost:5555/users_with_apology/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to create user and associate apology');
            }
          })
          .then(data => {
            console.log(data);
            resetForm(); 
            sessionStorage.removeItem('apology_id');  
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting your form. Please try again.');
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

            <BootstrapForm.Group controlId="formPassword">
              <BootstrapForm.Label>Password</BootstrapForm.Label>
              <Field name="password" type="password" as={BootstrapForm.Control} />
            </BootstrapForm.Group>

            <BootstrapForm.Group controlId="formRecipient">
              <BootstrapForm.Label>Recipient (Who)</BootstrapForm.Label>
              <Field name="recipient" type="text" as={BootstrapForm.Control} />
            </BootstrapForm.Group>

            <BootstrapForm.Group controlId="formEventDate">
              <BootstrapForm.Label>Event Date (When)</BootstrapForm.Label>
              <Field name="event_date" type="date" as={BootstrapForm.Control} />
            </BootstrapForm.Group>

            <BootstrapForm.Group controlId="formEventLocation">
              <BootstrapForm.Label>Event Location (Where)</BootstrapForm.Label>
              <Field name="event_location" type="text" as={BootstrapForm.Control} />
            </BootstrapForm.Group>

            <BootstrapForm.Group controlId="formCategory">
              <BootstrapForm.Label>Category</BootstrapForm.Label>
              <Field name="category_id" as={BootstrapForm.Control} component="select">
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </Field>
            </BootstrapForm.Group>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default EngagePage;
