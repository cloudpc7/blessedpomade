import '../../styles/modals/modal.scss';
import { Modal } from 'react-bootstrap';
import PomadeCard from '../../components/PomadeCard';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import ProductContext from '../../ProductContext';
import CheckOutModal from '../modals/CheckOutModal';

const PomadeSale = () => {
  const { getCart, showModal, handleClose } = useContext(ProductContext);

  return (
    <Modal 
      show={showModal} 
      onHide={handleClose} 
      size="sm" 
      className="sale-modal"
    >
       <Modal.Header closeButton>
        <Modal.Title>Blessed Pomade</Modal.Title>
       </Modal.Header>
        <Modal.Body>
          <PomadeCard />
          {
            getCart && <CheckOutModal />
          }
        </Modal.Body>
    </Modal>
  );
};

export default PomadeSale;
