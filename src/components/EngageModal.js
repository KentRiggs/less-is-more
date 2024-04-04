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
      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        setSubmitting(false);
        
        fetch('http://localhost:5555/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));
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

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EngageModal;
