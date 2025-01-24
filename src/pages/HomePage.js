import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Header from '../components/Header';
import pomadeHero from '../app/assets/images/pomade-mobile.png';
import pomadeHeroMd from '../app/assets/images/pomade-mobile-medium.png';
import pomadeLg from '../app/assets/images/pomade-large.png';
import '../styles/home/home.scss';
import PomadeSale from '../features/modals/PomadeSale';
import Welcome from '../components/Welcome';
import PomadeProduct from '../components/PomadeProduct';
import Faqs from '../components/Faqs';
import Testament from '../components/Testament';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useState, useEffect, useCallback } from 'react';
import { useSpring, animated, useTransition } from '@react-spring/web';

const colors = { 
  appWhite: '#FFFFFF',
};

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [showCallToAction, setShowCallToAction] = useState(window.innerWidth >= 992);
    const [showBlessed, setShowBlessed] = useState(false); // To toggle between titles

    const handleModal = () => {
        setShowModal(prevState => !prevState);
    };

    const checkWindowSize = useCallback(() => {
        setShowCallToAction(window.innerWidth >= 992);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', checkWindowSize);
        return () => window.removeEventListener('resize', checkWindowSize);
    }, [checkWindowSize]);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowBlessed(prev => !prev);
        }, 3000); // Switch every 3 seconds

        return () => clearInterval(interval); // Clean up on component unmount
    }, []);

    const transitions = useTransition(showBlessed, {
        from: { opacity: 0, transform: 'translateX(20px)' },
        enter: { opacity: 1, transform: 'translateX(0px)' },
        leave: { opacity: 0, transform: 'translateX(-20px)' },
        config: { duration: 500 },
    });

    return (
        <Container className="home-container">
            <Row className="hero-section">
                <Col>
                    <Card>
                        <Card.Img 
                            src={pomadeLg}
                        />
                        <Card.ImgOverlay>
                            <Header />
                            <Button onClick={handleModal} className="call-action">Feel Fresh</Button>
                            {showCallToAction && (
                                <div className="call-action-container">
                                    {transitions((styles, item) => item ? 
                                        <animated.h2 
                                            className="h2 call-action-title blessed-title" 
                                            style={{...styles, position: 'absolute', color: colors.burntOrange }}
                                        >
                                            <span className="blessed">Blessed</span> Pomade
                                        </animated.h2> : 
                                        <animated.h2 
                                            className="h2 call-action-title" 
                                            style={{...styles, position: 'absolute' }}
                                        >
                                            Feel Fresh, Feel Blessed
                                        </animated.h2>
                                    )}
                                </div>
                            )}
                        </Card.ImgOverlay>
                    </Card>
                </Col>
                {showModal && <PomadeSale showModal={showModal} onClose={() => setShowModal(false)} />}
            </Row>
            <Row className="home">
                <Col className="welcome-section">
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
            <Row className="footer">
                <Footer />
            </Row>
        </Container>
    );
};

export default HomePage;