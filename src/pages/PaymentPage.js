import { Container } from 'react-bootstrap';
import { Elements, ElementsConsumer, CardElement, PaymentElement, ShippingAddress } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import StripeContext from '../StripeContext';

const PaymentPage = () => {
  const { stripeKey } = useContext(StripeContext);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    if (stripeKey) {
      loadStripe(stripeKey)
        .then(stripeInstance => {
          setStripe(stripeInstance);
        })
        .catch(error => {
          console.error('Error loading Stripe:', error);
        });
    }
  }, [stripeKey]);

  if (!stripeKey || !stripe) {
    return <Container>Loading payment system...</Container>;
  }

  return (
    <Container>
      <Elements stripe={stripe}>
        <ElementsConsumer>
          {({ stripe, elements }) => (
            <>
              <ShippingAddress 
                allowedCountries={['US', 'CA']} // Example, customize as needed
                shippingType="shipping"
              />
              <PaymentElement />
              <button
                disabled={!stripe}
                onClick={async () => {
                  if (!stripe || !elements) return;
                  
                  const { error } = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                      return_url: window.location.origin + "/success",
                    },
                  });

                  if (error) {
                    console.error(error.message);
                  }
                }}
              >
                Pay
              </button>
            </>
          )}
        </ElementsConsumer>
      </Elements>
    </Container>
  );
};

export default PaymentPage;