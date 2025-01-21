import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store/store';
import { BrowserRouter } from 'react-router-dom';
import ProductProvider from './providers/ProductProvider';
import GoogleAddressProvider from './providers/GoogleAddressProvider';
import TransactionProvider from './providers/TransactionProvider';
import StripeProvider from './providers/StripeProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ProductProvider>
        <App />
        </ProductProvider>
      </BrowserRouter>
    </Provider>    
  </React.StrictMode>
);
