import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StripeContext from '../StripeContext';
import { fetchStripeApiKey, selectStripeApiKey } from '../components/stripeSlice'; 

const StripeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const stripeKey = useSelector(selectStripeApiKey);

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