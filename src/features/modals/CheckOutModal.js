import {Card, Button} from 'react-bootstrap';
import PomadeForm from '../../components/PomadeForm';
import { useContext } from 'react';
import ProductContext from '../../ProductContext';
import PomadeOrder from '../../components/PomadeOrder';

const CheckOutModal = () => {
    return (
        <Card>
        <PomadeOrder />
        <PomadeForm />
        </Card>
    );
};

export default CheckOutModal;