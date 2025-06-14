import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import './styles/main/main.scss';
import {  useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { handleAnonymousSignIn } from './firebaseConfig';
import SuccessPage from './pages/SuccessPage';
import Cancelled from './components/Cancelled';
function App() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.user ? state.user.user.uid : null);

  useEffect(() => {
    handleAnonymousSignIn(dispatch);
  }, [dispatch]);

  return (
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/success' element={<SuccessPage />}/>
      </Routes>
  );
}

export default App;
