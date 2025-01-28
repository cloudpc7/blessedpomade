import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Elements, ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { selectClientSecret, selectPaymentStatus, selectStripeApiKey, createPaymentIntent, saveAddressData } from '../components/stripeSlice';
import StripeContext from '../StripeContext';
import AddressForm from '../components/AddressForm';
import LoadingSpinner from '../utils/LoadingSpinner';
import Hero from '../components/Hero';
import '../styles/payment/payment.scss';
const PaymentPage = () => {
  const { stripeKey } = useContext(StripeContext);
  const [stripe, setStripe] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const dispatch = useDispatch();
  const clientSecret = useSelector(selectClientSecret);
  const paymentStatus = useSelector(selectPaymentStatus);
  const isLoading = useSelector(state => state.stripe.isLoading);
  const [useBillingAddress, setUseBillingAddress] = useState(false); 
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

  if (!stripeKey || isLoading) {
    return <LoadingSpinner />; // Show spinner while Stripe key is loading or any Stripe action is pending
  }

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
      try {
        const paymentIntentId = clientSecret.split('_secret')[0];
        await dispatch(saveAddressData({ shippingAddress, billingAddress, paymentIntentId })).unwrap();
        setSaveSuccess(true);
        setSaveError(null);
      } catch (saveError) {
        setSaveError(saveError.message);
      }
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Elements stripe={stripe} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
            <ElementsConsumer>
              {({ stripe, elements }) => (
                <Form onSubmit={handleSubmit}>
                  <h2>Payment</h2>
                  <PaymentElement />
                  
                  <h3>Shipping Address</h3>
                  <AddressForm showBilling={!useBillingAddress}/>
                  
                  {saveError && <Alert variant="danger">{saveError}</Alert>}
                  {saveSuccess && <Alert variant="success">Address saved successfully!</Alert>}
                  
                  <Button type="submit" disabled={!stripe || isLoading}>
                    Pay
                  </Button>
                </Form>
              )}
            </ElementsConsumer>
          </Elements>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;