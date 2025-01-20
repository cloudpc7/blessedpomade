import { Container, Row, Col } from 'react-bootstrap';
import '../styles/home/testament/testament.scss';
const Testament = () => {
    return (
        <Container className="testament-container">
            <Row className="testament-row">
                <Col className="testament-col">
                    <h2 className="h2 testament-title">what clients say</h2>
                </Col>
                <Col className="testament-col">
                    <p className="testament">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                     sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </Col>
                <Col className="testament-col">
                    <p className="testament">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                     sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </Col>
                <Col className="testament-col">
                    <p className="testament">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                     sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Testament;