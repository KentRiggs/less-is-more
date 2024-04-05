import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Form as BootstrapForm } from 'react-bootstrap';

const EngageModal = () => {
  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        recipient: '', // Corresponds to "who"
        event_date: '', // Corresponds to "when"
        event_location: '', // Corresponds to "where"
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        // Adjusted to send all necessary information to your endpoint
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
        })
        .catch(error => {
          console.error('Error:', error);
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

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EngageModal;
