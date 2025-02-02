import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store/store';
import ProductProvider from './providers/ProductProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
      <BrowserRouter>
        <ProductProvider>
          <App />
        </ProductProvider>
      </BrowserRouter>
    </Provider> 
);
