import { Container, Row, Col, Button, Card} from 'react-bootstrap';
import Header from '../components/Header';
import pomadeHero from '../app/assets/images/pomade-mobile.png';
import '../styles/home/home.scss';
import PomadeSale from '../features/modals/PomadeSale';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
import Welcome from '../components/Welcome';
import PomadeProduct from '../components/PomadeProduct';
import Faqs from '../components/Faqs';
import Testament from '../components/Testament';
import Buy from '../components/Buy';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
    const {handleModal, showModal} = useContext(ProductContext);
    return (
        <Container className="home-container">
            <Row className="hero-section">
                <Col>
                    <Card>
                        <Card.Img src={pomadeHero} alt="black barber shop chair with blessed pomade" />
                        <Card.ImgOverlay>
                            <Header />
                                <Button onClick={handleModal} className="call-action">Feel Fresh</Button>
                        </Card.ImgOverlay>
                    </Card>
                </Col>
                {
                    showModal && <PomadeSale showModal={showModal}/>
                }
            </Row>
            <Row className="home">
                <Col>
                  <Welcome /> 
                </Col>
                <Col className="product-section">
                    <PomadeProduct />
                </Col>
                <Col className="Faqs-section">
                    <Faqs />
                </Col>
                <Col className="testimony-section">
                    <Testament />
                </Col>
                <Col className="contact-section">
                    <Contact />
                </Col>
            </Row>
            <Row>
                <Col className="footer-section">
                    <Footer />
                </Col>
            </Row>
        </Container>
    )
}

export default HomePage;