import React, { useState, useEffect } from 'react';
import StripeContext from '../StripeContext';
const StripeProvider = ({ children }) => {
  const [clientSecret, setClientSecret] = useState(null);

  const handlePayment = async (event) => {
    event.preventDefault();

    // Proceed with payment logic
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }), // Example amount
    });

    const { clientSecret } = await response.json();
    setClientSecret(clientSecret); // Set the clientSecret

    // const result = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card,
    //     billing_details: {
    //       name: 'Customer Name',
    //       email: 'customer@example.com',
    //     },
    //   },
    // });

    // if (result.error) {
    //   console.error(result.error.message);
    // } else if (result.paymentIntent.status === 'succeeded') {
    //   console.log('Payment successful!');
    // }
  };

  const contextValue = {
    handlePayment,
  };

  return (
    <StripeContext.Provider value={contextValue}>
            {children}
    </StripeContext.Provider>
  );
};

export default StripeProvider;
