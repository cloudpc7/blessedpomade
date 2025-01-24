import { Container } from 'react-bootstrap';
import '../styles/home/welcome/welcome.scss';

const Welcome = () => {
    return (
        <Container className="welcome-container">
            <div className="welcome-content">
                <h1 className="h1 welcome-title">Feel Fresh, Feel Blessed</h1>
                <div className="welcome-statement">
                    <p className="statement-left">Welcome to BlessedPomade.com, where you can find the best <strong>water-based hair pomade</strong> that not only styles your hair effortlessly but also ensures it feels fresh and blessed. Our <strong>natural hair pomade</strong> is designed for those who seek simplicity in styling with the assurance of easy wash-out, leaving your hair healthy and vibrant.</p>
                    <ul className="statement-right">
                        <li>100% Water-Based Formula - Easy to Wash Out!</li>
                        <li>Perfect Hold for All Hair Types</li>
                        <li>Natural Ingredients for Healthy Hair</li>
                        <li>Feel Fresh, Feel Blessed with Every Use</li>
                    </ul>
                </div>
            </div>
        </Container>
    );
};

export default Welcome;