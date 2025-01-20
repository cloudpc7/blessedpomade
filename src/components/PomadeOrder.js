import { Card, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
import { useState } from 'react';
import { useTransition, animated } from 'react-spring';
import pomade from '../app/assets/images/pomade_product_small.png';
import PomadeProduct from './PomadeProduct';
import '../styles/home/product/cart.scss';
import { Link } from 'react-router-dom';
const PomadeOrder = () => {
    const { cartCount, subTotal, handleSubmit } = useContext(ProductContext);
    const [visible, setVisible] = useState(false);
    const [check, setCheck] = useState(false);
    const transitions = useTransition(visible, {
        from: { opacity: 0, transform: 'translateX(-100%)' },
        enter: { opacity: 1, transform: 'translateX(0%)' },
        leave: { opacity: 0, transform: 'translateX(100%)' },
        config: { mass: 1, tension: 280, friction: 60 },
    });
    return (
        <div
            className="cart-container"
        >
            {transitions((styles, item) => (
                item ? 
                <animated.div 
                    style={{
                        ...styles,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }} 
                    className="cart-animate"
                >
                 <Card className="cart-product-card">
                    <Card.Img className="cart-product" src={pomade}/>
                        <Card.Text 
                            className="cart-title"
                        >
                            Blessed Pomade
                            <span className="weight">4.250z</span>
                        </Card.Text>
                        <Card.Body className="cart-details">
                            <div className="cart-item">
                                <Card.Text>product price</Card.Text>
                                <Card.Text>$13.99</Card.Text>
                            </div>
                            <div className="cart-item">
                                <Card.Text>Quantity</Card.Text>
                                <Card.Text className="cart-price">{cartCount}</Card.Text>
                            </div>
                            <div className="cart-item">
                                <Card.Text>sub-total</Card.Text>
                                <Card.Text>{subTotal}</Card.Text>
                            </div>
                            <Form className="cart-form">
                                <Form.Check 
                                    label={ 
                                        <Link className="term-link" href="/terms">
                                            accept terms and conditions
                                        </Link>
                                    }
                                    name="accept"
                                    type="checkbox"
                                    checked={check}
                                    onChange={() => setCheck(!check)}
                                    className="cart-check"
                                />
                                <Form.Group>
                                <Button  
                                    className="cart-btn"
                                    onClick={handleSubmit}
                                    type="submit"
                                    disabled={!check}
                                >
                                    check out
                                </Button>
                                </Form.Group>
                            </Form>
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
                    <PomadeProduct />
                </animated.div>
            ))}
           
        </div>
    );
};

export default PomadeOrder;