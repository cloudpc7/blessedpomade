import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store/store';
import ProductProvider from './providers/ProductProvider';
import StripeProvider from './providers/StripeProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
        <ProductProvider>
          <App />
        </ProductProvider>
        </PersistGate>
      </BrowserRouter>
    </Provider> 
);
