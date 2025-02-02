import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
    updateCart: (state, action) => {
      state.items = action.payload || [];
      state.count = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      state.total = state.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
      state.error = null;
    },
    addToCart: (state, action) => {
      const { id, product, price, quantity } = action.payload;
      if (!id || !product || !price || !quantity) {
        console.error('Invalid item data for addToCart:', action.payload);
        return;
      }
      const itemInCart = state.items.find((cartItem) => cartItem.id === id);
      if (itemInCart) {
        // If item exists, update quantity rather than replacing
        itemInCart.quantity += quantity;
      } else {
        state.items.push({ id, product, price, quantity });
      }
      // Update count and total
      state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      if (!itemId) {
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
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  setLoading, 
  setError, 
  updateCart, 
} = cartSlice.actions;
export const cartSliceReducer = cartSlice.reducer;

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (payload, { dispatch, getState }) => {
    dispatch(setLoading(true));
    const { id, product, price, quantity } = payload;
    const userId = getState().user.user ? getState().user.user.uid : null;
    console.log(userId);
    if (!userId) {
      console.error('User ID not available. Please log in or create an account.');
      dispatch(setError('User ID not available. Please log in or create an account.'));
      throw new Error('No user ID available');
    }

    try {
      const response = await fetch('https://us-central1-blessedpomade.cloudfunctions.net/api/cart-items', {
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
        console.error('API response not OK:', errorText);
        throw new Error(errorText || 'Failed to update cart');
      }
      const result = await response.json();
      dispatch(updateCart(result.cart)); 
      return { userId: userId, cart: result.cart };
    } catch (error) {
      console.error('Error in addToCartAsync:', error);
      dispatch(setError(error.message)); 
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/decrementCartItemAsync',
  async (payload, { dispatch, getState }) => {
    dispatch(setLoading(true));
    const { id, quantity } = payload;
    const userId = getState().user.user ? getState().user.user.uid : null;

    try {
      const response = await fetch(`https://us-central1-blessedpomade.cloudfunctions.net/api/update-cart-item/${userId}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: quantity }), // Send only the quantity to decrement
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response not OK:', errorText);
        throw new Error(errorText || 'Failed to update cart item');
      }

      const result = await response.json();
      dispatch(updateCart(result.cart)); // Update the cart with the new data from the server
      return result.cart;
    } catch (error) {
      console.error('Error in decrementCartItemAsync:', error);
      dispatch(setError(error.message)); 
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const incrementCartItemAsync = createAsyncThunk(
  'cart/incrementCartItemAsync',
  async (payload, { dispatch, getState }) => {
    dispatch(setLoading(true));
    const { id, quantity } = payload;
    const userId = getState().user.user ? getState().user.user.uid : null;

    if (!userId) {
      console.error('User ID not available. Please log in or create an account.');
      dispatch(setError('User ID not available. Please log in or create an account.'));
      throw new Error('No user ID available');
    }

    try {
      const response = await fetch(`https://us-central1-blessedpomade.cloudfunctions.net/api/update-cart-item/${userId}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: quantity }), // Send just the quantity to add
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response not OK:', errorText);
        throw new Error(errorText || 'Failed to update cart item');
      }

      const result = await response.json();
      dispatch(updateCart(result.cart)); 
      return result.cart;
    } catch (error) {
      console.error('Error in incrementCartItemAsync:', error);
      dispatch(setError(error.message)); 
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

