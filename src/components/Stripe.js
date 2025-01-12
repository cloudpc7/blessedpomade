import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load your publishable key from Stripe
const stripePromise = loadStripe('your-publishable-key'); // Replace with your Stripe publishable key

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return; // Ensure stripe.js is loaded

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    // 1. Call your backend to create a payment intent
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1000 }), // Example amount, in cents
    });
    const { clientSecret } = await response.json();

    // 2. Confirm the payment on the client-side
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
      // Proceed with saving the shipping info and sending confirmation
      // Call backend to process the transaction
      await fetch('/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingInfo: { /* shipping details */ },
          productId: 'productId', // Example
          totalPrice: 1000, // Example amount
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

// Wrap the form in Elements provider
const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;
