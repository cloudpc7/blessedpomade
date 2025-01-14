import { Container, Row, Col } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import './styles/main/main.scss';
import { useEffect } from 'react';
import ShoppingCart from './pages/ShoppingCart';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <Container>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/cart' element={<ShoppingCart />}/>
        <Route path="/paymentform" element={<PaymentPage />} />
      </Routes>
    </Container>
  );
}

export default App;
