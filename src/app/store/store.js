import { configureStore } from '@reduxjs/toolkit';
import { stripeReducer } from '../../components/stripeSlice';
import { cartReducer } from '../../utils/cartSlice';
import sessionStorage from 'redux-persist/es/storage/session';
import { userSliceReducer } from '../../utils/userSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage:sessionStorage,
  whitelist: ['stripe', 'cart', 'user']
};

// Wrapping the reducer with persistReducer
const persistedStripeReducer = persistReducer(persistConfig, stripeReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer);
const persistedUserReducer = persistReducer(persistConfig, userSliceReducer);
export const store = configureStore({
  reducer: {
    stripe: persistedStripeReducer, 
    cart: persistedCartReducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);