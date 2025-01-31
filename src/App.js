import { Container } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import './styles/main/main.scss';
import PaymentPage from './pages/PaymentPage';
import StripeProvider from './providers/StripeProvider';
import {  useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { handleAnonymousSignIn } from './firebaseConfig';
import { updateCart } from './utils/cartSlice';
function App() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.user ? state.user.user.uid : null);

  useEffect(() => {
    handleAnonymousSignIn(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const synCart = async () => {
      if(userId) {
        try {
          const response = await fetch(`/cart/${userId}`);
          if(response.ok) {
            const data  = await response.json();
            dispatch(updateCart(data.cart));
          };
        } catch (error) {
          console.error("Failed to sync cart:", error);
        }
      }
    }
    synCart();
  }, [dispatch, userId]);

  return (
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route 
          path='/payment'
          element={
            <StripeProvider>
              <PaymentPage />
            </StripeProvider>
          }
        />
      </Routes>
  );
}

export default App;
