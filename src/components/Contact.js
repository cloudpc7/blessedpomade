import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { useState, useEffect } from 'react'; // Removed useContext as it wasn't used
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import '../styles/home/contact/contact.scss';

const Contact = () => {
    const handleSubmit = async (values) => {
        // Assuming you're sending data to a server
        console.log(values);
        try {
            // Here you could implement logic to send form data to an API
            // await fetch('/api/send-email', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(values)
            // });
            // Alert for successful submission
            alert('Message sent successfully!');
        } catch (error) {
            // Handle errors here
            console.error('An error occurred:', error);
            alert('Error sending message. Please try again later.');
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .min(2, 'Name should be at least 2 characters')
            .max(50, 'Name should not exceed 50 characters')
            .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        subject: Yup.string().required('Subject is required'),
        message: Yup.string().required('Message is required'),
    });

    return (
        <Container className="contact-container">
            <Row className="contact">
                <Col className="title-col">
                <h2 className="h2 contact-title">Contact Us</h2>
                </Col>
                <Col className="contact-statement">
                    <p>Have Questions About Our Products or Need Service Support? Contact Us!</p>
                    <p>At Blessed Pomade, we're committed to providing you with exceptional customer service. Whether you have inquiries about our products, require assistance with services, or seek tips and recommendations on using Blessed Pomade, we're here for you. Reach out to us via:</p>
                    <ListGroup className='contact-list'>
                        <ListGroup.Item>
                            <Link to="https://instagram.com" className="instagram-link">
                                <FontAwesomeIcon icon={faInstagram} size="2x" /></Link>
                            </ListGroup.Item>
                        <ListGroup.Item>
                            <Link className="email-link">Email:alex.85marroquin@gmail.com</Link>
                        </ListGroup.Item>
                    </ListGroup>
                    <p>Thank you for choosing Blessed Pomade. We appreciate your support and are dedicated to offering you the best in customer care.</p>
                </Col>
                <Col className="contact-form-col">
                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            subject: '',
                            message: '',
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            touched,
                            isValid,
                            dirty,
                            errors,
                            values,
                        }) => (
                            <Form className="contact-form" noValidate onSubmit={handleSubmit}>
                                {['name', 'email', 'subject', 'message'].map((field) => (
                                    <Form.Group key={field} className="form-item">
                                        <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                                        <Form.Control
                                            type={field === 'email' ? 'email' : 'text'}
                                            as={field === 'message' ? 'textarea' : 'input'}
                                            name={field}
                                            placeholder={field}
                                            value={values[field]}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched[field] && !!errors[field]}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
                                    </Form.Group>
                                ))}
                                <Form.Group className="form-item">
                                    <Button 
                                        className="message-btn" 
                                        type="submit" 
                                        disabled={!isValid || !dirty}
                                        aria-label="Send message"
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />
                                        <span className="btn-text">Send</span>
                                    </Button>
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
};

export default Contact;