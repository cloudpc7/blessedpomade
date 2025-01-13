import { Card } from 'react-bootstrap';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
const PomadeOrder = () => {
    const { quantity, subTotal, productDetail } = useContext(ProductContext);
    return (
        <Card>
            <Card.Title>Cart</Card.Title>
            <Card.Img />
            <Card.Body>
                <Card.Text>{productDetail}</Card.Text>
                <Card.Text>{quantity}</Card.Text>
                <Card.Text>{subTotal}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default PomadeOrder;