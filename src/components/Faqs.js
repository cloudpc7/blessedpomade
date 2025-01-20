import { Container, Row, Col } from 'react-bootstrap';
import "../styles/home/faqs/faqs.scss";

const Faqs = () => {
    return (
        <Container className="faqs-container">
            <Row className="faqs-row">
                <Col className="faqs-col">
                    <h3 className="h3 faqs-title">Why Blessed Pomade</h3>
                </Col>
                <Col className="faqs-col">
                    <p className="faqs">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </Col>
                <Col className="faqs-col">
                    <p className="faqs">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </Col>
                <Col className="faqs-col">
                    <p className="faqs">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Faqs;