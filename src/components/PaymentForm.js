import {  Form, Button } from 'react-bootstrap';
import StripeContext from '../StripeContext';
import { useContext } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';

const PaymentForm = () => {
    // const { handleSubmit, stripe } = useContext(StripeContext);
    const handleSubmit = () => {};
    return (
      <Form onSubmit={handleSubmit}>
        <PaymentElement />
        <Button type="submit" >Submit</Button>
      </Form>
    )
};

export default PaymentForm;