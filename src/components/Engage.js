import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import './index.css'; 

const EngagePage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
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
    <div className="engage-container">
      <h1 className="engage-title">Complete Your Apology</h1>
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
          const apologyId = sessionStorage.getItem('apology_id');
          if (!apologyId) {
            alert("No apology ID found. Please start from the Home page.");
            setSubmitting(false);
            return;
          }
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
            <Field name="username" type="text" placeholder="who are you?" className="engage-input" />
            <Field name="email" type="email" placeholder="what is your email address?" className="engage-input" />
            <Field name="password" type="password" placeholder="enter a password" className="engage-input" />
            <Field name="recipient" type="text" placeholder="who were they?" className="engage-input" />
            <Field name="event_date" type="date" placeholder="when was it?" className="engage-input" />
            <Field name="event_location" type="text" placeholder="where was it" className="engage-input" />
            <Field as="select" name="category_id" className="engage-select">
              <option value="">Select an apology Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </Field>
            <div></div>
            <button type="submit" className="engage-button" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EngagePage;
