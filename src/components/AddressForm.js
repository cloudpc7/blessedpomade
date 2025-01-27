import {AddressElement} from '@stripe/react-stripe-js';

const AddressForm = () => {
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
            <AddressElement onChange={handleChange} options={{mode: 'shipping'}} />
            <AddressElement onChange={handleChange} options={{mode: 'billing'}}/>
        </form>
        
    )
}

export default AddressForm;