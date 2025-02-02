import { AddressElement } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { updateShippingAddress, updateBillingAddress } from '../../additionalFiles/stripeSlice';

const AddressForm = ({ showBilling }) => {
    const dispatch = useDispatch();

    const handleChange = (event, mode) => {
        if (event.complete) {
          const address = event.value.address;
          if (mode === 'shipping') {
            dispatch(updateShippingAddress(address));
          } else if (mode === 'billing') {
            dispatch(updateBillingAddress(address));
          }
        }
      };

    return (
        <form className="address-container">
            <AddressElement 
                onChange={(event) => handleChange(event, 'shipping')} 
                options={{mode: 'shipping'}} 
            />
            {showBilling && (
                <AddressElement 
                    onChange={(event) => handleChange(event, 'billing')} 
                    options={{mode: 'billing'}}
                />
            )}
        </form>
    );
}

export default AddressForm;