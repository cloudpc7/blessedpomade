import { AddressElement } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { updateShippingAddress, updateBillingAddress } from '../components/stripeSlice';

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
        <form>
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