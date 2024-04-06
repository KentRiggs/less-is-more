import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Container, Form as BootstrapForm } from 'react-bootstrap';
import NavigationBar from './NavigationBar';  // Assuming you have this component for navigation

const AmendPage = () => {
  const initialValues = {
    username: '',
    email: '',
  };

  return (
    <Container>
      <NavigationBar />
      <h1>Edit User</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          setSubmitting(true);

          fetch(`http://localhost:5555/users/`, { 
            method: 'PATCH', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
          .then(response => {
            setSubmitting(false);
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Network response was not ok.');
            }
          })
          .then(data => {
            console.log(data);
            // Redirect or handle success case
          })
          .catch(error => {
            console.error('Error:', error);
            setSubmitting(false);
          });
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
