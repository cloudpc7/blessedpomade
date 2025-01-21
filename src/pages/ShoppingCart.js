import { Container, Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
import PomadeForm from '../components/PomadeForm';
const ShoppingCart = () => {

    const {price, quantity, } = useContext(ProductContext);

    return (
        <Container>
            <PomadeForm />
        </Container>
    )
};

export default ShoppingCart;