import { Form, Card,Button } from 'react-bootstrap';
import pomade from '../app/assets/images/pomade_product_small.png';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
import { Link } from 'react-router-dom';
const PomadeCard = () => {
   const {
    count, 
    handleDecrement, 
    handleIncrement, 
    handleCount,
    productDetail,
    handleCheckOut,
    } = useContext(ProductContext);

    return (
        <>
         <Card>
            <Card.Body>
                <Card.Img src={pomade} alt="blessed pomade product"/>
                <Card.Body>
                    <Card.Text>
                        {productDetail}
                    </Card.Text>
                </Card.Body>
            </Card.Body>
        </Card>
        <Card>
            <Button onClick={handleDecrement}>-</Button>
                <Form.Control type="number" min="1" name="quantity" value={count} onChange={(e) => handleCount(e)}/>
           <Button onClick={handleIncrement}>+</Button>
           <Button onClick={handleCheckOut}>checkout</Button>
        </Card>
        </>
    )
}

export default PomadeCard;