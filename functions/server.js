import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../src/App.js';  // The entry point of your React app
import { Provider } from 'react-redux';
import { store } from '../src/app/store/store.js';
import ProductProvider from '../src/providers/ProductProvider.js';
import SessionProvider from '../src/providers/SessionProvider.js';

// Server-side render function
const serverRender = (req) => {
  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <SessionProvider>
          <ProductProvider>
            <App />
          </ProductProvider>
        </SessionProvider>
      </StaticRouter>
    </Provider>
  );
};

export default serverRender;
