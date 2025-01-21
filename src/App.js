import { Container } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import './styles/main/main.scss';
import ShoppingCart from './pages/ShoppingCart';
import PaymentPage from './pages/PaymentPage';
function App() {

  return (
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/cart' element={<ShoppingCart />}/>
        <Route 
          path='/checkout'
          element={<PaymentPage />}
        />
      </Routes>
  );
}

export default App;
