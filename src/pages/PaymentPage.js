import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Elements, ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { selectClientSecret, selectPaymentStatus, createPaymentIntent, saveAddressData } from '../components/stripeSlice';
import StripeContext from '../StripeContext';
import AddressForm from './AddressForm';

const PaymentPage = () => {
  const { stripeKey } = useContext(StripeContext);
  const [stripe, setStripe] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const dispatch = useDispatch();
  const clientSecret = useSelector(selectClientSecret);
  const paymentStatus = useSelector(selectPaymentStatus);
  const shippingAddress = useSelector(state => state.stripe.shippingAddress);
  const billingAddress = useSelector(state => state.stripe.billingAddress);

  useEffect(() => {
    if (stripeKey) {
      loadStripe(stripeKey).then(setStripe).catch(console.error);
    }
  }, [stripeKey]);

  useEffect(() => {
    if (!clientSecret && paymentStatus === 'idle') {
      dispatch(createPaymentIntent(Math.round(13.99 * 100)));
    }
  }, [clientSecret, paymentStatus, dispatch]);

  // ... Other rendering conditions ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/success",
      },
    });

    if (error) {
      console.error(error.message);
    } else {
      // Save address data on successful payment
      try {
        const paymentIntentId = clientSecret.split('_secret')[0];
        await dispatch(saveAddressData({ shippingAddress, billingAddress, paymentIntentId })).unwrap();
        setSaveSuccess(true);
        setSaveError(null);
        console.log('Payment processed and address data saved successfully');
        // Navigate to success page or update UI
      } catch (saveError) {
        console.error('Failed to save address data:', saveError);
        setSaveError(saveError.message);
      }
    }
  };

  return (
    <Container>
      <Elements stripe={stripe} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
        <ElementsConsumer>
          {({ stripe, elements }) => (
            <Form onSubmit={handleSubmit}>
              <h2>Payment</h2>
              <PaymentElement />
              
              <h3>Shipping Address</h3>
              <AddressForm />
              
              {saveError && <Alert variant="danger">{saveError}</Alert>}
              {saveSuccess && <Alert variant="success">Address saved successfully!</Alert>}
              
              <Button type="submit" disabled={!stripe}>
                Pay
              </Button>
            </Form>
          )}
        </ElementsConsumer>
      </Elements>
    </Container>
  );
};

export default PaymentPage;