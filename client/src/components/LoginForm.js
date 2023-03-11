// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap'; // Use Bootstrap for styling

import { useMutation } from '@apollo/react-hooks'; // Use the useMutation hook from the Apollo library
import { LOGIN_USER } from '../utils/mutations'; // Import the LOGIN_USER mutation
import Auth from '../utils/auth'; // Import the Auth object from the utils folder

const LoginForm = () => {
  // Set up state variables using the useState hook
  const [userFormData, setUserFormData] = useState({ email: '', password: '' }); // User's form data
  const [validated, setValidated] = useState(false); // Whether or not the form has been validated
  const [showAlert, setShowAlert] = useState(false); // Whether or not to show the alert
  const [login, { error }] = useMutation(LOGIN_USER); // Use the LOGIN_USER mutation

  // Use the useEffect hook to handle errors
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  // Handle changes to the input fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handle the form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validate the form
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({
        variables: { ...userFormData },
      });

      console.log(data);
      Auth.login(data.login.token); // Log the user in and store their token
    } catch (e) {
      console.error(e);
    }

    // Clear the form values
    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button disabled={!(userFormData.email && userFormData.password)} type='submit' variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
