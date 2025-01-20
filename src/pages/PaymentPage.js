import { Container } from 'react-bootstrap';
import PaymentForm from '../components/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import StripeContext from '../StripeContext';
const PaymentPage = () => {
    const { stripeKey, stripeClientSecret } = useContext(StripeContext);
    const [stripe, setStripe] = useState(null);

    useEffect(() => {
        if(stripeKey && stripeClientSecret) {
            loadStripe(stripeKey)
            .then(stripeInstance => {
                setStripe(stripeInstance);
            })
            .catch(error => {
                console.error('Error loading Stripe:', error);
            });
        }
    },[stripeKey, stripeClientSecret]);

    const options = {
        clientSecret: stripeClientSecret,
    };


    return (
        
        <Container>
            {
                stripeKey && stripeClientSecret ? (
                    <Elements stripe={stripe} options={options}>
                        <PaymentForm />
                    </Elements>
                ) : (
                    <div>...Loading</div>
                )
            }
        </Container>
    );
};

export default PaymentPage;
