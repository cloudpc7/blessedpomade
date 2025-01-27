import { configureStore } from '@reduxjs/toolkit';
import { stripeReducer } from '../../components/stripeSlice';
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
  storage,
  // You can specify which reducers to persist
  whitelist: ['stripe'] // Only persist the 'stripe' slice
};

// Wrapping the reducer with persistReducer
const persistedStripeReducer = persistReducer(persistConfig, stripeReducer);

export const store = configureStore({
  reducer: {
    stripe: persistedStripeReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);