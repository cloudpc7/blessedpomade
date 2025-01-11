import '../../styles/modals/modal.scss';
import { Modal } from 'react-bootstrap';
import PomadeCard from '../../components/PomadeCard';
const PomadeSale = ({ showModal, handleClose }) => {
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
        </Modal.Body>
    </Modal>
  );
};

export default PomadeSale;

// <Modal >
//      
//       <Modal.Body>
//         

//         <Formik
//           initialValues={{
//             firstName: '',
//             lastName: '',
//             street: '',
//             city: '',
//             state: '',
//             zip: '',
//           }}
//           onSubmit={handleSubmit}
//         >
//           {({ values, handleChange, handleBlur }) => (
//             <Form noValidate>
//               
//               
//               </Form.Group>
//               <Form.Group>
//                 <Form.Label>Street Address</Form.Label>
//                 {
//                   isLoaded && 
//                   <StandaloneSearchBox
//                     onLoad={(ref) => inputRef.current = ref}
//                     onPlacesChanged={handleOnPlacesChanged}
//                   >
//                     <Form.Control
//                       id="location-input"
//                       type="text"
//                       name="street"
//                       placeholder="Street Address"
//                       value={values.street}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                     />
//                   </StandaloneSearchBox>
//                 }
//               </Form.Group>
//               
//               <Button type="submit">Submit</Button>
//             </Form>
//           )}
//         </Formik>
//       </Modal.Body>
//     </Modal>
