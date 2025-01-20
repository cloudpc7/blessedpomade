import { Container, Row, Col } from 'react-bootstrap';
import '../styles/home/welcome/welcome.scss';
const Welcome = () => {
    return (
        <Container className="welcome-container">
            <Row className="welcome-row">
                <Col className="welcome-col">
                    <h2 className="h2 welcome-title">Welcome</h2>
                </Col>
                <Col className="welcome-statement">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Col>
            </Row>
        </Container>
    );
};

export default Welcome;