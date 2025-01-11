import {useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card} from 'react-bootstrap';
import Header from '../components/Header';
import pomadeHero from '../app/assets/images/pomade-mobile.png';
import '../styles/home/home.scss';
import PomadeSale from '../features/modals/PomadeSale';
const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    return (
        <Container className="home-container">
            <Row>
                <Col>
                    <Card>
                        <Card.Img src={pomadeHero} alt="black barber shop chair with blessed pomade" />
                        <Card.ImgOverlay>
                            <Header />
                                <Button onClick={() => setShowModal(true)} className="call-action">Feel Fresh</Button>
                                <Card.Title>Blessed Pomade</Card.Title>
                                    <Card.Body>
                                        <Card.Text>
                                            bless the day with a fresh look.
                                        </Card.Text>
                                    </Card.Body>
                        </Card.ImgOverlay>
                    </Card>
                </Col>
                {
                    showModal && <PomadeSale showModal={showModal} handleClose={handleClose}/>
                }
            </Row>
            <Row>
                <Col>
                  Welcome Section  
                </Col>
                <Col>
                    Product Section
                </Col>
                <Col>
                    Why Blessed Pomade section
                </Col>
                <Col>
                    What people Say, Proof ! Testimonials
                </Col>
                <Col>
                    Buy Product Section
                </Col>
                <Col>
                    Contact Section
                </Col>
                <Col>
                    Footer Section
                </Col>
            </Row>
        </Container>
    )
}

export default HomePage;