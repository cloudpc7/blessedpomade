import { configureStore } from '@reduxjs/toolkit';
import { stripeReducer } from '../../components/stripeSlice';
import { cartSliceReducer } from '../../utils/cartSlice';
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

// Configuration for Redux Persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage: sessionStorage,
  whitelist: ['stripe', 'cart', 'user'],
  blacklist: [], // If there are reducers you explicitly do not want to persist
};

// Wrapping reducers with persistReducer for state persistence
const persistedStripeReducer = persistReducer(persistConfig, stripeReducer);
const persistedCartReducer = persistReducer(persistConfig, cartSliceReducer);
const persistedUserReducer = persistReducer(persistConfig, userSliceReducer);

// Configure the store
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
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in non-production environments
});

// Create persistor for persistence
export const persistor = persistStore(store);

// Optional: Logging for debugging in development
// if (process.env.NODE_ENV !== 'production') {
//   store.subscribe(() => {
//     const state = store.getState();
//   });
// }

// if (process.env.NODE_ENV === 'production') {
//   let lastState = store.getState();
//   store.subscribe(() => {
//     const state = store.getState();
//     if (state.error) {
//       console.error('Store Error:', state.error);
//     }
//     lastState = state;
//   });
// }