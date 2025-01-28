import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StripeContext from '../StripeContext';
import { fetchStripeApiKey, selectStripeApiKey } from '../components/stripeSlice'; 

const StripeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const stripeKey = useSelector(selectStripeApiKey);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  useEffect(() => {
    if (!stripeKey && !stripeLoaded) {
      dispatch(fetchStripeApiKey());
      setStripeLoaded(true);
    }
  }, [dispatch, stripeKey, stripeLoaded]);
  const contextValue = {
    stripeKey,
  };

  return (
    <StripeContext.Provider value={contextValue}>
      {children}
    </StripeContext.Provider>
  );
};

export default StripeProvider;