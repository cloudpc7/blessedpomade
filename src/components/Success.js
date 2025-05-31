import { Container, Row, Image, Button } from 'react-bootstrap';
import blessed from '../app/assets/images/pomade-logo.png';
import '../styles/success/success.scss';
import { Link } from 'react-router-dom';

const Success = () => {
    return (
        <Container id="success" className="success-container">
            <Row className="justify-content-center align-items-center success-content">
                <div className="blessed-logo-wrapper">
                    <Image src={blessed} className="blessed-logo" alt="Blessed Pomade Logo" />
                </div>
                <div className="text-center success-message">
                    <h2 className="h2 success-heading">Thank You for Choosing Blessed Pomade!</h2>
                    <p className="success-text">
                        Your order has been placed successfully. We are thrilled that you've chosen our product to enhance your style.
                    </p>
                    <p className="success-text">
                        Enjoy the divine experience of Blessed Pomade, and may it bring blessings to your look each day!
                    </p>
                    <Button variant="outline-primary" as={Link} to="/" className="mt-3 success-button">
                        Return to Home
                    </Button>
                </div>
            </Row>
        </Container>
    );
};

export default Success;