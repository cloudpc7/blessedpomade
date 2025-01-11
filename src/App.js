import { Container, Row, Col } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import './styles/main/main.scss';
import ShoppingCart from './pages/ShoppingCart';

function App() {
  return (
    <Container>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/cart' element={<ShoppingCart />}/>
      </Routes>
    </Container>
  );
}

export default App;
