import { Form, Card,Button } from 'react-bootstrap';
import pomade from '../app/assets/images/pomade_product_small.png';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
import { Link } from 'react-router-dom';
const PomadeCard = () => {
   const {
        price,
        quantity,
        handleDecrement, 
        handleIncrement, 
        handleAddToCart,
        handleChange,
    } = useContext(ProductContext);

    return (
         <Card>
            <Card.Body>
                <Card.Img src={pomade} alt="blessed pomade product"/>
                <Card.Title>Blessed Pomade</Card.Title>
                <Card.Text>
                    {price}
                </Card.Text>
                <Card.Text>
                    Quantity
                </Card.Text>
                <Button className="product-count" onClick={handleDecrement}>-</Button>
                <Form.Control 
                    type="number"
                    value={quantity}
                    onChange={handleChange}
                    min="1"
                />
                <Button className="product-count" onClick={handleIncrement}>+</Button>
                <Link  to="cart" className="chk-btn" >checkout</Link>
            </Card.Body>
        </Card>

    )
}

export default PomadeCard;