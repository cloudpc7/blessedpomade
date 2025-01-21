import { Form, Card,Button } from 'react-bootstrap';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
import { useState } from 'react';
const PomadeCard = () => {
    const handleDecrement = () => {};
    const handleIncrement = () => {};
    const handleCheckOut = () => {};
    const [cartCount, setCartCount] = useState(null);
    const handleCount = () => {};
    return (
        <>
         <Card>
            <Card.Body>
                
                <Card.Body>
                    <Card.Text>
                        {/* {productDetail} */}
                    </Card.Text>
                </Card.Body>
            </Card.Body>
        </Card>
        <Card>
            <Button onClick={handleDecrement}>-</Button>
                <Form.Control type="number" min="1" name="quantity" value={cartCount} onChange={(e) => handleCount(e)}/>
           <Button onClick={handleIncrement}>+</Button>
           <Button onClick={handleCheckOut}>checkout</Button>
        </Card>
        </>
    )
}

export default PomadeCard;