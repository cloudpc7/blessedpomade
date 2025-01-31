import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { Elements, ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { selectClientSecret, selectPaymentStatus, selectStripeApiKey, createPaymentIntent, saveAddressData } from '../components/stripeSlice';
import StripeContext from '../StripeContext';
import AddressForm from '../components/AddressForm';
import LoadingSpinner from '../utils/LoadingSpinner';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
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
  const cartItems = useSelector(state => state.cart.items);
  const subTotal = useSelector(state => state.cart.total);

  useEffect(() => {
    if (stripeKey) {
      loadStripe(stripeKey).then(setStripe).catch(console.error);
    }
  }, [stripeKey]);

  useEffect(() => {
    if (!clientSecret && paymentStatus === 'idle') {
      dispatch(createPaymentIntent(Math.round(subTotal * 100))); // Use dynamic total from cart
    }
  }, [clientSecret, paymentStatus, dispatch, subTotal]);

  if (!stripeKey || isLoading) {
    return <LoadingSpinner />; 
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
    <Container className="payment-container">
      <Row className="payment-row">
        <Col className="hero-section">
          <Hero />
        </Col>
        <Col className="payment-col">
          <Elements stripe={stripe} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
            <ElementsConsumer>
              {({ stripe, elements }) => (
                <Form className="payment-form" onSubmit={handleSubmit}>
                  <h2 className="payment-title">Payment</h2>
                  <h3 className="payment-title">Your Order</h3>
                  <ListGroup variant="flush">
                    {cartItems.map(item => (
                      <ListGroup.Item key={item.id}>
                        <Row>
                          <Col>{item.name || item.id}</Col>
                          <Col>Quantity: {item.quantity}</Col>
                          <Col>Price: ${item.price.toFixed(2)}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <h4 className="payment-title">Subtotal: ${subTotal.toFixed(2)}</h4>

                  <Col className="payment-element-col">
                    <PaymentElement />
                  </Col>  
                  <h3 className="payment-title">Shipping Address</h3>
                    <AddressForm showBilling={!useBillingAddress} />
                  {saveError && <Alert variant="danger">{saveError}</Alert>}
                  {saveSuccess && <Alert variant="success">Address saved successfully!</Alert>}
                  
                  <Button className="payment-btn" type="submit" disabled={!stripe || isLoading}>
                    Pay
                  </Button>
                </Form>
              )}
            </ElementsConsumer>
          </Elements>
        </Col>
        <Col className="footer-col">
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;