import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store/store';
import { BrowserRouter } from 'react-router-dom';
import ProductProvider from './providers/ProductProvider';
import GoogleAddressProvider from './providers/GoogleAddressProvider';
import TransactionProvider from './providers/TransactionProvider';
import StripeProvider from './providers/StripeProvider';
import { PersistGate } from 'redux-persist/integration/react';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
        <ProductProvider>
        <StripeProvider>
          <App />
        </StripeProvider>
        </ProductProvider>
        </PersistGate>
      </BrowserRouter>
    </Provider>    
  </React.StrictMode>
);
