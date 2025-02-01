import { Container, Form, Card, Button, Row, Col } from 'react-bootstrap';
import pomade from '../app/assets/images/pomad_small.png';
import '../styles/home/product/product.scss';
import { useTransition, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
import { useEffect, useRef } from 'react';
const PomadeProduct = () => {
    const { 
        view,
        setView,
        cartCount, 
        addToCart, 
        subTotal, 
        handleDecrement, 
        handleIncrement, 
        handleCheckout,
        handleGoBack,
        check,
        setCheck,
        pomadeProductId,
        goToCart,
        quantity,
      } = useContext(ProductContext);
    const cartRef = useRef(null);
    useEffect(() => {
        if (view === 'cart' && cartRef.current) {
            // Use requestAnimationFrame for better performance, ensuring scroll happens after render
            requestAnimationFrame(() => {
                cartRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    }, [view]);
    const transitions = useTransition(view, {
        key: view,
        from: { opacity: 0, transform: 'translateX(-100%)' },
        enter: { opacity: 1, transform: 'translateX(0%)' },
        leave: { opacity: 0, transform: 'translateX(100%)' },
        config: { mass: 1, tension: 280, friction: 60 },
    });

    const handleAddToCart = (event) => {
        event.preventDefault();
        const itemData = {
            id: pomadeProductId, 
            product: 'Blessed Pomade',
            price: 13.99, 
            quantity: quantity  
        };
        addToCart(event, itemData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCheckout();
    }

    return (
        <Container id="cart-section" className="product-container">
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
                                                type="button" 
                                                className="cart-btn"
                                                onClick={() => setView('cart')}
                                                aria-label="Go to Cart"
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
                                        <p className="product-title">
                                            Blessed Pomade 
                                            <span className="weight">4.250z</span>
                                        </p>
                                        <Card.Text className="product-price">$13.99</Card.Text>
                                        <Button  
                                            className="product-btn"
                                            onClick={handleAddToCart}
                                            aria-label="Add Blessed Pomade to Cart"
                                            type="button"
                                        >
                                            Add to Cart
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12} lg={6} className="special-offer-col">
                                <Card className="special-offer-card">
                                    <Card.Body>
                                        <h4 className="card-title">Special Offer</h4>
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
                            <p className="product-title">
                                Blessed Pomade
                                <span className="weight">4.250z</span>
                            </p>
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
                                        onClick={() => handleDecrement('pomade')} 
                                        className="quantity-btn"
                                        aria-label="Decrease Quantity"
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </Button>
                                    <span className="cart-count">{cartCount}</span>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => handleIncrement('pomade')} 
                                        className="quantity-btn"
                                        aria-label="Increase Quantity"
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                </div>
                                <Form className="cart-form" onSubmit={handleSubmit}>
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
                                        aria-label="Accept terms and conditions"
                                    />
                                    <Form.Group className="cart-buttons">
                                        <Button  
                                            className="cart-btn"
                                            type="submit"
                                            aria-label="Proceed to Checkout"
                                        >
                                            Checkout
                                        </Button>
                                        <Button  
                                            className="cart-btn"
                                            onClick={handleGoBack}
                                            aria-label="Return to Product View"
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