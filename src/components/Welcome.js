import { Container, Row, Col } from 'react-bootstrap';
import '../styles/home/welcome/welcome.scss';

const Welcome = () => {
    return (
        <Container className="welcome-container">
            <Row className="welcome-row">
                <Col className="welcome-col">
                    <h1 className="h1 welcome-title">Feel Fresh, Feel Blessed</h1>
                </Col>
                <Col className="welcome-statement">
                    <p>Welcome to BlessedPomade.com, where you can find the best <strong>water-based hair pomade</strong> that not only styles your hair effortlessly but also ensures it feels fresh and blessed. Our <strong>natural hair pomade</strong> is designed for those who seek simplicity in styling with the assurance of easy wash-out, leaving your hair healthy and vibrant.</p>
                    <ul>
                        <li>100% Water-Based Formula - Easy to Wash Out!</li>
                        <li>Perfect Hold for All Hair Types</li>
                        <li>Natural Ingredients for Healthy Hair</li>
                        <li>Feel Fresh, Feel Blessed with Every Use</li>
                    </ul>
                </Col>
            </Row>
        </Container>
    );
};

export default Welcome;