import { Container } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import './styles/main/main.scss';
import PaymentPage from './pages/PaymentPage';
function App() {

  return (
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route 
          path='/payment'
          element={<PaymentPage />}
        />
      </Routes>
  );
}

export default App;
