import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StripeContext from '../StripeContext';
import { fetchStripeApiKey, selectStripeApiKey } from '../components/stripeSlice'; 

const StripeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const stripeKey = useSelector(selectStripeApiKey);

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

  useEffect(() => {
    if (!stripeKey) {
      dispatch(fetchStripeApiKey());
    }
  }, [dispatch, stripeKey]);
  const contextValue = {
    stripeKey,
    handleChange,
  };

  return (
    <StripeContext.Provider value={contextValue}>
      {children}
    </StripeContext.Provider>
  );
};

export default StripeProvider;