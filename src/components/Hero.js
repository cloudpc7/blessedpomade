import { Card } from 'react-bootstrap';
import Header from './Header';
const Hero = () => {
    const [showCallToAction, setShowCallToAction] = useState(window.innerWidth >= 992);
    const [showModal, setShowModal] = useState(false);
    const checkWindowSize = useCallback(() => {
            setShowCallToAction(window.innerWidth >= 992);
        }, []);

    return (
        <>
            <Card>
                <Card.Img 
                        src={pomadeHero}
                    srcSet={`${pomadeHero} 375w, ${pomadeLg} 768w, ${pomadeLg} 1920w`}
                    sizes="(max-width: 375px) 100vw, (max-width: 768px) 100vw, 100vw"
                />
                <Card.ImgOverlay>
                    <Header />
                    <Button onClick={handleModal} className="call-action">Feel Fresh</Button>
                    {showCallToAction && (
                        <div className="call-action-container">
                            {transitions((styles, item) => item ? 
                                <animated.h1 
                                    className="h1 call-action-title blessed-title" 
                                    style={{...styles, position: 'absolute', color: colors.burntOrange }}
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