
import { StandaloneSearchBox } from '@react-google-maps/api';
import '../styles/modals/modal.scss';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { useState, useEffect, useContext } from 'react';
import ProductContext from '../ProductContext';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
const PomadeForm = () => {

    const {
        inputRef,
        isLoaded,
        handleOnPlacesChanged,
        addressInfo,
        handleSubmit,
        isValid,
        setIsValid,
        validateAddressWithGoogle,
    } = useContext(ProductContext);
    const [streetAddress, setStreetAddress] = useState('');
    
    const handleAddress = (event, setFieldValue) => {
        const address = event.target.value;
        setFieldValue("street", address);
        setStreetAddress(address);
    };

    useEffect(() => {
            const validateAddress = async () => {
                if(streetAddress) {
                    const validAddress = await validateAddressWithGoogle(streetAddress);
                    if(validAddress) {
                        console.log('Street adddress is valid');
                    } else {
                        console.log('Street address is invalid');
                    }
                }
            }
        if(!isValid) {
            validateAddress();
            setIsValid(true);
            console.log(isValid);
        }

    }, [streetAddress, validateAddressWithGoogle]);


    const validationSchema = Yup.object({
        firstName: Yup.string().required('First name is required')
        .min(2, 'First name should be at least 2 characters')
        .max(50, 'First name should not exceed 50 characters')
        .matches(/^[A-Za-z\s]+$/, 'First name can only contain letters and spaces'),
        lastName: Yup.string().required('Last name is required')
        .min(2, 'First name should be at least 2 characters')
        .max(50, 'First name should not exceed 50 characters')
        .matches(/^[A-Za-z\s]+$/, 'Last name can only contain letters and spaces'),
        email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
        street: Yup.string().required('Street address is required')
        .min(3, 'Street Address should be at least 3 characters'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        zip: Yup.string().required('Zip code is required')
        .matches(/^[0-9]{5}$/, 'Zip code must be exactly 5 digits'),

    });

    return (
        <Formik
            initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            street: '',
            city: addressInfo.city,
            state: addressInfo.state,
            zip: addressInfo.zip,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
        {({ 
            values,
            handleBlur, 
            handleChange,  
            touched, 
            errors,  
            setFieldValue,
            setFieldTouched, 
            handleSubmit 
            }) => (
            <Form noValidate onSubmit={(e) => handleSubmit(e, streetAddress)}>
                <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.firstName && !!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.lastName && !!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}  
                    onChange={handleChange}  
                    onBlur={handleBlur}  
                    isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                <Form.Label>
                    street address
                </Form.Label>
                {
                    isLoaded &&
                    <StandaloneSearchBox
                    onLoad={(ref) => inputRef.current = ref}
                    onPlacesChanged={() => handleOnPlacesChanged(setFieldValue)}
                >
                    <Form.Control 
                        ref={inputRef}
                        type="text"
                        name="street"
                        value={values.street}
                        placeholder="address"
                        onBlur={handleBlur}
                        onChange={(e) => handleAddress(e, setFieldValue)}
                        isInvalid={touched.street && !!errors.street}
                    />
                </StandaloneSearchBox>
                }
                <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                    type="text"
                    name="city"
                    placeholder="City"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.city && !!errors.city}
                    readOnly
                />
                <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                    type="text"
                    name="state"
                    placeholder="State"
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.state && !!errors.state}
                    readOnly
                    />
                    <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                    type="text"
                    name="zip"
                    placeholder="Zip Code"
                    value={values.zip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.zip && !!errors.zip}
                    readOnly
                    />
                    <Form.Control.Feedback type="invalid">{errors.zip}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button as={Link} to="/paymentform" type="submit" disabled={!isValid}>pay now</Button>
                </Form.Group>
                </Form>
            )}
        </Formik>
    )
}

export default PomadeForm;