import { Container, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { useState, useEffect, useContext } from 'react';
import * as Yup from 'yup';
import '../styles/home/contact/contact.scss';
const Contact = () => {

    const handleSubmit = (values) => {
        console.log(values);
    }

    const validationSchema = Yup.object({
            name: Yup.string().required('First name is required')
            .min(2, 'First name should be at least 2 characters')
            .max(50, 'First name should not exceed 50 characters')
            .matches(/^[A-Za-z\s]+$/, 'First name can only contain letters and spaces'),
            email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
            subject: Yup.string().required('Subject is required'),
            message: Yup.string().required('Message is required'),
        });

    return (
        <Container className="contact-container">
            <h2 className="h2 contact-title">contact us</h2>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                }}
                onSubmit={(values) => handleSubmit(values)}
                validationSchema={validationSchema}
            >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    touched,
                    isValid,
                    errors,
                    values,
                }) => (
                <Form className="contact-form" noValidate onSubmit={handleSubmit}>
                    <Form.Group>
                    <Form.Label>name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="name"
                        value={values.name}
                        onChange={handleChange}
                        isValid={touched.name && !!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="email address"
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={touched.email && !!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>subject</Form.Label>
                    <Form.Control
                        type="text"
                        name="subject"
                        placeholder="subject"
                        value={values.subject}  
                        onChange={handleChange}    
                        isInvalid={touched.subject && !!errors.subject}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                    <Form.Control
                        type="text"
                        as="textarea"
                        name="message"
                        placeholder="message"
                        value={values.message}  
                        onChange={handleChange}    
                        isInvalid={touched.message && !!errors.message}
                    />
                    <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Button type="submit" disabled={!isValid}>send</Button>
                    </Form.Group>
                    </Form>
                )}
        </Formik>
    </Container>
    );
};

export default Contact;