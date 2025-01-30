import { Card, Button } from 'react-bootstrap';
import { useEffect, useState, useCallback } from 'react';
import pomadeHero from '../app/assets/images/pomade-test-mobile.png';
import Header from './Header';
import pomadeLg from '../app/assets/images/hero-image.png';
import { useSpring, animated, useTransition } from '@react-spring/web';
import '../styles/payment/payment.scss';

const Hero = () => {
    const [showCallToAction, setShowCallToAction] = useState(window.innerWidth >= 992);
    const [showModal, setShowModal] = useState(false);
    const [showBlessed, setShowBlessed] = useState(false);

    const checkWindowSize = useCallback(() => {
        setShowCallToAction(window.innerWidth >= 992);
    }, []);

    const handleModal = () => {
        setShowModal(prevState => !prevState);
    };

    // Toggle between the two titles
    useEffect(() => {
        const timer = setInterval(() => {
            setShowBlessed(prev => !prev);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    // Transition for the title animation
    const transitions = useTransition(showBlessed, {
        from: { opacity: 0, transform: 'translateX(20px)' },
        enter: { opacity: 1, transform: 'translateX(0px)' },
        leave: { opacity: 0, transform: 'translateX(-20px)' },
        config: { duration: 500 },
    });

    useEffect(() => {
        window.addEventListener('resize', checkWindowSize);
        return () => window.removeEventListener('resize', checkWindowSize);
    }, [checkWindowSize]);

    return (
        <>
            <Card className="hero-card">
                <Card.Img 
                    src={pomadeHero}
                    srcSet={`${pomadeHero} 375w, ${pomadeLg} 768w, ${pomadeLg} 1920w`}
                    sizes="(max-width: 375px) 100vw, (max-width: 768px) 100vw, 100vw"
                    alt="Hero Image"
                />
                <Card.ImgOverlay>
                    <Header />
                    <Button onClick={handleModal} className="call-action">Feel Fresh</Button>
                    {showCallToAction && (
                        <div className="call-action-container">
                            {transitions((styles, item) => item ? 
                                <animated.h1 
                                    className="h1 call-action-title blessed-title" 
                                    style={{...styles, position: 'absolute', color: 'burntOrange' }}
                                >
                                    <span className="blessed">Blessed</span> Pomade
                                </animated.h1> : 
                                <animated.h1 
                                    className="h1 call-action-title" 
                                    style={{...styles, position: 'absolute' }}
                                >
                                    Feel Fresh, Feel Blessed
                                </animated.h1>
                            )}
                        </div>
                    )}
                </Card.ImgOverlay>
            </Card>
            {showModal && <PomadeSale showModal={showModal} onClose={() => setShowModal(false)} />}
        </>
    )
}

export default Hero;