import { Container, Row, Col  } from 'react-bootstrap';
import '../styles/footer/footer.scss';
const Welcome = () => {
    return (
        <Container className="footer-container">
            <Row className="footer-row">
                <Col className="social-section">
                    <h4 className="h3 footer-title">Social Media</h4>
                </Col>
                <Col className="about-section">
                    <h4 className="h3 footer-title">about</h4>
                </Col>
                <Col className="message-section">
                    <h4 className="h3 footer-title">message</h4>
                </Col>
                <Col className="help-section">
                    <h4 className="h3 footer-title">about</h4>
                </Col>
                <Col className="policy-section">
                    <h4 className="h3 footer-title">info</h4>
                </Col>
                <Col className="order-section">
                    <h4 className="h3 footer-title">orders</h4>
                </Col>
                <Col className="copyright-section">
                    <p><span>&#169;</span>2025 BlessedPomade. All Rights Reserved</p>
                </Col>
                <Col className="developer-section">
                    <p>Website created by <a>Clouddropdesigns.com</a>2025</p>
                    <p><span>&#169;</span>all rights reserverd</p>
                </Col>
            </Row>
        </Container>
    );
};

export default Welcome;