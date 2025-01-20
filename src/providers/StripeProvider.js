import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StripeContext from '../StripeContext';
import { useTransactionManager } from '../utils/transactionManager';
import { fetchStripeApi, selectStripeApiKey, selectClientSecret, postClientSecret } from '../components/stripeSlice';

const StripeProvider = ({ children }) => {
  const { transaction } = useTransactionManager();
  const dispatch = useDispatch();
  const stripeKey = useSelector(selectStripeApiKey);
  const stripeClientSecret = useSelector(selectClientSecret);
  useEffect(() => {
    dispatch(fetchStripeApi());
    dispatch(postClientSecret());
  }, [dispatch]);

  const contextValue = {
    transaction,
    stripeKey,
    stripeClientSecret,
  }
 
  return (
    <StripeContext.Provider value={contextValue}>
            {children}
    </StripeContext.Provider>
  );
};

export default StripeProvider;