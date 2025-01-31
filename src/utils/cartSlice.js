import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userSliceReducer } from './userSlice';
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    count: 0,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { id,product, price, quantity } = action.payload;
      if (!id || !product || !price || !quantity) {
        console.error('Invalid item data for addToCart:', action.payload);
        return;
      }
      const itemInCart = state.items.find((cartItem) => cartItem.id === id);
      if (itemInCart) {
        itemInCart.quantity = quantity;
      } else {
        state.items.push({ id,product, price, quantity });
      }
      state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      if (!itemId) {
        console.error('Invalid item ID for removeFromCart:', itemId);
        return;
      }
      state.items = state.items.filter(item => item.id !== itemId);
      state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateCart: (state, action) => {
      state.items = action.payload || [];
      state.count = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      state.total = state.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
      state.error = null;
    }
  }, 
});

export const { addToCart, removeFromCart, setLoading, setError, updateCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (payload, { dispatch, getState }) => {
    dispatch(setLoading(true));
    const { id, product, price, quantity } = payload;
    const userId = getState().user.user ? getState().user.user.uid : null;
    console.log(userId);
    console.log('Adding to cart:', payload);

    if (!userId) {
      console.error('User ID not available. Please log in or create an account.');
      dispatch(setError('User ID not available. Please log in or create an account.'));
      throw new Error('No user ID available');
    };

    payload.userId = userId;

    try {
      const response = await fetch('/cart-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: userId,
          productId: id,
          productName: product,
          price: price,
          quantity: quantity,
          timestamp: new Date().toISOString() 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update cart');
      }
      const result = await response.json();
      dispatch(addToCart({ 
        id: id, 
        product: product,
        price: price, 
        quantity: quantity
      })); 

      dispatch(updateCart(result.cart)); 
      return { userId: userId, cart: result.cart };
    } catch (error) {
      console.error('Failed to update cart:', error);
      dispatch(setError(error.message)); 
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);



