import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { Container } from 'react-bootstrap';
import '../styles/home/testament/testament.scss';
import hairstyle1 from '../app/assets/images/hairstyle1.png';
import hairstyle2 from '../app/assets/images/hair2.png';
import hairstyle3 from '../app/assets/images/hair3.png';

const images = [
    hairstyle1,
    hairstyle2,
    hairstyle3,
];

const Testament = () => {
    const testimonials = [
        { text: "Blessed Pomade has transformed my hair routine. No more greasy feeling, just fresh, stylish hair all day!", name: "John D.", image: images[0] },
        { text: "I was skeptical about water-based pomades until I tried Blessed. The hold is impressive and it washes out so easily.", name: "Emily S.", image: images[1] },
        { text: "My hair has never looked this good. It's natural, holds well, and doesn't damage my hair.", name: "Lucas M.", image: images[2] }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
    const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

    const springProps = useSpring({
        // from: { opacity: 0 },
        // to: { opacity: 1 },
        // reset: true,
        // config: { mass: 1, tension: 170, friction: 26 },
    });

    return (
        <Container className="testament-container">
            <h2 className="h2 testament-title">What Clients Say</h2>
            <div className="carousel-container">
                <animated.div style={springProps} className="carousel-content">
                    <div className="testimonial-image" style={{ backgroundImage: `url(${testimonials[activeIndex].image})` }}>
                        <div className="testimonial-overlay">
                            <p className="testament">{testimonials[activeIndex].text}</p>
                            <small className="testament-name">- {testimonials[activeIndex].name}</small>
                            <div className="carousel-nav">
                                <button onClick={handlePrev} className="carousel-prev" aria-label="Previous testimonial">‹</button>
                                <button onClick={handleNext} className="carousel-next" aria-label="Next testimonial">›</button>
                            </div>
                        </div>
                    </div>
                </animated.div>
            </div>
        </Container>
    );
};

export default Testament;