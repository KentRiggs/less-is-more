import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Modal, Button, Form as BootstrapForm } from 'react-bootstrap';

const AmendModal = ({ userId, currentUsername, currentEmail, show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          username: currentUsername,
          email: currentEmail,
        }}
        onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            setSubmitting(true);
            //issue with modal routes 
            fetch(`http://localhost:5555/users/${userId}`, { 
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
              handleClose();  
            })
            .catch(error => {
              console.error('Error:', error);
              setSubmitting(false);  
            });
          }}
          
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <BootstrapForm.Group controlId="formUsername">
                <BootstrapForm.Label>Username</BootstrapForm.Label>
                <Field name="username" type="text" as={BootstrapForm.Control} />
              </BootstrapForm.Group>

              <BootstrapForm.Group controlId="formEmail">
                <BootstrapForm.Label>Email</BootstrapForm.Label>
                <Field name="email" type="email" as={BootstrapForm.Control} />
              </BootstrapForm.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AmendModal;
