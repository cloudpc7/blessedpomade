import { Container, Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import ProductContext from '../ProductContext';
import PomadeForm from '../components/PomadeForm';
import PomadeOrder from '../components/PomadeOrder';
const ShoppingCart = () => {

    const {price, quantity, } = useContext(ProductContext);

    return (
        <Container>
            <PomadeForm />
            <PomadeOrder />
        </Container>
    )
};

export default ShoppingCart;