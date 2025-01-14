import { Container, Row, Col } from 'react-bootstrap';
import PaymentForm from '../components/PaymentForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
const stripePromise = loadStripe('pk_test_51QfVA1IMAr2rME9PThfDWjvbhpZa7fHuIQ886wVuAsFv2zHc0x04eerI4SuUjdCYtNOiiGabR1NWiDWMDPBUUSZh006svUuUYn');
const PaymentPage = () => {
    const [clientSecret, setClientSecret ] = useState('');
    useEffect(() => {
        const fetchClientSecret = async () => {
            const response = await fetch('http://localhost:5001/blessedpomade/us-central1/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: 1000 }), // Amount in cents
            });

            const { clientSecret } = await response.json();
            setClientSecret(clientSecret);
        };

        fetchClientSecret();
    }, []);

    if(!clientSecret) {
        return <div>Loading...</div>;
    }
    
    const options = {
         clientSecret: clientSecret,
    };

    return (
        <Container>
        <Row>
            <Col>
                <Elements stripe={stripePromise} options={options}>
                    <PaymentForm />
                </Elements>
            </Col>
        </Row>
        </Container>
    );
};

export default PaymentPage;
