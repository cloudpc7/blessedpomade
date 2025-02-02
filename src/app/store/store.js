import { configureStore } from '@reduxjs/toolkit';
import { cartSliceReducer } from '../../utils/cartSlice';
import { userSliceReducer } from '../../utils/userSlice';

// Configure the Redux store for production
export const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    user: userSliceReducer,
  },
  devTools: false,
});

export default store;