import {Card, Button} from 'react-bootstrap';
import PomadeForm from '../../components/PomadeForm';
import { useContext } from 'react';
import ProductContext from '../../ProductContext';

const CheckOutModal = () => {
    return (
        <Card>
            <PomadeForm />
        </Card>
    );
};

export default CheckOutModal;