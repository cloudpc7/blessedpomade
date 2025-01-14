import { Card, Form, Button } from 'react-bootstrap';
import { PaymentElement } from '@stripe/react-stripe-js';
import { useContext } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const PaymentForm = () => {

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
        return; // Stripe.js hasn't loaded yet
    }

    const response = await fetch('http://localhost:5001/blessedpomade/us-central1/api/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), // amount in cents, $10.00 is 1000 cents
    });

    const { clientSecret } = await response.json();  // Get the client secret from the backend

    // Create a PaymentMethod for the card
    const card = elements.getElement(CardElement);

    // Confirm the payment using the client secret
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                name: 'Customer Name',  // Optional: use the actual customer's name if available
            },
        },
    });

    if (error) {
        console.error("Payment failed: ", error.message);
    } else {
        if (paymentIntent.status === 'succeeded') {
            console.log("Payment successful!");
            // Optionally handle post-payment logic (e.g., show confirmation to the user)
        }
    }
};
    return (
      <Form onSubmit={handleSubmit}>
        <CardElement />
        <Button type="submit" disabled={!stripe}>Submit</Button>
      </Form>
    )
};

export default PaymentForm;