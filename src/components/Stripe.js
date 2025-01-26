import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your-publishable-key'); 

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return; 

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1000 })
    });
    const { clientSecret } = await response.json();

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error('Payment failed:', error.message);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      console.log('Payment successful:', paymentIntent);
      await fetch('/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingInfo: {  },
          productId: 'productId',
          totalPrice: 1000,
        }),
      });
      alert('Purchase successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe || isProcessing}>Pay</button>
    </form>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;
