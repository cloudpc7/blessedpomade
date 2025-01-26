import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StripeContext from '../StripeContext';
import { fetchStripeApiKey, setCartCount, selectStripeApiKey, selectCartCount } from '../components/stripeSlice'; // Ensure this path is correct
import ProductContext from '../ProductContext';

const StripeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const stripeKey = useSelector(selectStripeApiKey);
  const cartCountFromRedux = useSelector(selectCartCount);
  const { cartCount } = useContext(ProductContext);
  const [localCartCount, setLocalCartCount] = useState(0);

  useEffect(() => {
    setLocalCartCount(cartCount);
    dispatch(setCartCount(cartCount)); 
  }, [cartCount, dispatch]);

  useEffect(() => {
    if (!stripeKey && localCartCount > 0) {
      dispatch(fetchStripeApiKey());
    }
  }, [dispatch, stripeKey, localCartCount]);

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