import { Card, Button } from 'react-bootstrap';
import { useState } from 'react';
import pomade from '../app/assets/images/pomade_product_small.png';
import '../styles/home/product/product.scss';
import { useTransition, animated } from 'react-spring';
import PomadeOrder from './PomadeOrder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PomadeProduct = () => {
    // const {cartCount, addToCart, handleShowCart, visible, toggleCart} = useContext(ProductContext);
    const [visible, setVisible] = useState(false);
    const [cartCount, setCartCount] = useState(null);
    const [toggleCart, setToggleCart] = useState(false);
    const addToCart = () => {
        setCartCount((prev) => prev + 1);
    }
    const transitions = useTransition(visible, {
        from: { opacity: 0, transform: 'translateX(-100%)' },
        enter: { opacity: 1, transform: 'translateX(0%)' },
        leave: { opacity: 0, transform: 'translateX(100%)' },
        config: { mass: 1, tension: 280, friction: 60 },
    });

    return (
        <div
            className="product-container"
        >
            {transitions((styles, item) => (
                item ? 
                <animated.div
                    className="animate-div"
                    style={{
                        ...styles,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }} 
                >
                    <Card className="pomade-product-card">
                        <div 
                            className="cart-items" 
                            style={
                                toggleCart ? {visibility:'visible'} : {visibility: 'hidden'}
                            }
                        >
                            <FontAwesomeIcon className="cart-icon" icon="fa-cart-shopping" size="2x" />
                            <span className="cart-count">{cartCount}</span>
                            <Button 
                                type="submit" 
                                className="cart-btn"
                                onClick={() => setVisible(!visible)}
                            >
                                Go to Cart
                            </Button>
                        </div>
                        <Card.Img className="product-img" src={pomade}/>
                        <Card.Body className="product-details">
                            <Card.Text className="product-title">
                                Blessed Pomade
                                <span className="weight">4.250z</span>
                            </Card.Text>
                            <Card.Text className="product-price">$13.99</Card.Text>
                            <Button  
                                className="product-btn"
                                onClick={addToCart}
                            >
                                Add to Cart
                            </Button>
                        </Card.Body>
                    </Card>
                </animated.div> :
                <animated.div style={{
                    ...styles,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
                className="animate-div"
                >
                    <PomadeOrder />
                </animated.div>
            ))}
        </div>
    );
};

export default PomadeProduct;