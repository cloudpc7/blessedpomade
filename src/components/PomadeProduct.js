import { Container, Form, Card, Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import pomade from '../app/assets/images/pomad_small.png';
import '../styles/home/product/product.scss';
import { useTransition, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const PomadeProduct = () => {
    const [cartCount, setCartCount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [view, setView] = useState('product');
    const [check, setCheck] = useState(false);
    const productPrice = 13.99;

    const addToCart = () => {
        setCartCount((prev) => prev + 1);
    };

    const handleSubmit = () => {};
    const handleGoBack = () => setView('product');

    // Function to increase cart count
    const handleIncrement = () => {
        setCartCount(prev => prev + 1);
    };

    // Function to decrease cart count
    const handleDecrement = () => {
        if (cartCount > 0) {
            setCartCount(prev => prev - 1);
        }
    };

    useEffect(() => {
        setSubTotal(cartCount * productPrice);
    }, [cartCount]);

    const transitions = useTransition(view, {
        key: view,
        from: { opacity: 0, transform: 'translateX(-100%)' },
        enter: { opacity: 1, transform: 'translateX(0%)' },
        leave: { opacity: 0, transform: 'translateX(100%)' },
        config: { mass: 1, tension: 280, friction: 60 },
    });

    return (
        <Container className="product-container">
            {transitions((styles, item) => (
                <animated.div
                    className="animate-div"
                    style={{
                        ...styles,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%'
                    }}
                >
                    {item === 'product' ? (
                        <Row className="product-row">
                            <Col xs={12} lg={6} className="product-col">
                                <Card className="pomade-product-card">
                                    {cartCount > 0 && (
                                        <div className="cart-items">
                                            <FontAwesomeIcon className="cart-icon" icon={faShoppingCart} size="2x" />
                                            <span className="cart-count">{cartCount}</span>
                                            <Button 
                                                type="submit" 
                                                className="cart-btn"
                                                onClick={() => setView('cart')}
                                            >
                                                Go to Cart
                                            </Button> 
                                        </div>
                                    )}
                                    <Card.Img 
                                        className="product-img"
                                        src={pomade}
                                        alt="Blessed Pomade hair pomade product"
                                    />
                                    <Card.Body className="product-details">
                                        <Card.Text  
                                            className="product-title"
                                        >
                                            blessed pomade 
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
                            </Col>
                            <Col xs={12} lg={6} className="special-offer-col">
                                <Card className="special-offer-card">
                                    <Card.Body>
                                        <Card.Title>Special Offer</Card.Title>

                                        <Card.Text>Buy two Get One Free!</Card.Text>
                                        <Card.Text>Use Code: BeBlessed</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <Card className="cart-product-card">
                            <Card.Img 
                                className="product-img"
                                src={pomade}
                                alt="Blessed Pomade hair pomade product"   
                            />
                            <Card.Text className="product-title">
                                Blessed Pomade
                                <span className="weight">4.250z</span>
                            </Card.Text>
                            <Card.Body className="cart-details">
                                <div className="cart-item">
                                    <Card.Text>Product Price</Card.Text>
                                    <Card.Text>$13.99</Card.Text>
                                </div>
                                <div className="cart-item">
                                    <Card.Text>Subtotal</Card.Text>
                                    <Card.Text>${subTotal.toFixed(2)}</Card.Text>
                                </div>
                                <div className="cart-item">
                                    <Card.Text>Quantity</Card.Text>
                                    <Card.Text className="cart-price">{cartCount}</Card.Text>
                                </div>
                                <div className="cart-item quantity-control">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleDecrement} 
                                        className="quantity-btn"
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </Button>
                                    <span className="cart-count">{cartCount}</span>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleIncrement} 
                                        className="quantity-btn"
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                </div>
                                <Form className="cart-form">
                                    <Form.Check 
                                        label={ 
                                            <Link className="term-link" to="/terms">
                                                Accept terms and conditions
                                            </Link>
                                        }
                                        name="accept"
                                        type="checkbox"
                                        checked={check}
                                        onChange={() => setCheck(!check)}
                                        className="cart-check"
                                    />
                                    <Form.Group className="cart-buttons">
                                        <Button  
                                            className="cart-btn"
                                            onClick={handleSubmit}
                                            type="submit"
                                            disabled={!check}
                                        >
                                            Checkout
                                        </Button>
                                        <Button  
                                            className="cart-btn"
                                            onClick={handleGoBack}
                                        >
                                            Go Back
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}
                </animated.div>
            ))}
        </Container>
    );
};

export default PomadeProduct;