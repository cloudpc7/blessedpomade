import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    count: 0,
    total: 0,
    loading: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      if (!item || !item.id || !item.price) {
        console.error('Invalid item data for addToCart:', item);
        return;
      }
      const itemInCart = state.items.find((cartItem) => cartItem.id === item.id);
      if (itemInCart) {
        itemInCart.quantity += item.quantity || 1; // Ensure quantity is set if not provided
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
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
      const removeIndex = state.items.findIndex(item => item.id === itemId);
      if (removeIndex !== -1) {
        state.count -= state.items[removeIndex].quantity;
        state.total -= state.items[removeIndex].price * state.items[removeIndex].quantity;
        state.items.splice(removeIndex, 1);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload || {};
      if (!id || typeof quantity !== 'number') {
        console.error('Invalid updateQuantity payload:', action.payload);
        return;
      }
      const item = state.items.find(item => item.id === id);
      if (item) {
        const prevQuantity = item.quantity;
        item.quantity = quantity;
        state.count += quantity - prevQuantity;
        state.total += (item.price * (quantity - prevQuantity));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.count = 0;
      state.total = 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateCart: (state, action) => {
      state.items = action.payload || [];
      state.count = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      state.total = state.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setLoading, updateCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

// Async thunk for adding item to cart
export const addToCartAsync = createAsyncThunk('cart/addToCartAsync', async (payload, { dispatch, getState }) => {
  const sessionToken = getState().session.sessionToken;
  if (!sessionToken) {
    console.error('No session token available');
    throw new Error('Session token not available');
  }
  dispatch(setLoading(true));
  const item = payload.item || payload;
  
  try {
    const response = await fetch('https://us-central1-blessedpomade.cloudfunctions.net/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Session-Token': sessionToken,
      },
      body: JSON.stringify({ item }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add item to cart');
    }

    const result = await response.json();
    console.log('Server response in addToCartAsync:', result);
    dispatch(updateCart(result.cart));
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    dispatch(removeFromCart(item.id)); // Revert local state
    throw error; // Re-throw the error so the state can react to the failure
  } finally {
    dispatch(setLoading(false));
  }
});

// Async thunk for removing item from cart
export const removeFromCartAsync = createAsyncThunk('cart/removeFromCartAsync', async (itemId, { dispatch, getState }) => {
  const sessionToken = getState().session.sessionToken;
  if (!sessionToken) {
    console.error('No session token available');
    throw new Error('Session token not available');
  }
  dispatch(removeFromCart(itemId));
  dispatch(setLoading(true));
  try {
    const response = await fetch(`https://us-central1-blessedpomade.cloudfunctions.net/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Session-Token': sessionToken
      }
    });
    if (!response.ok) throw new Error('Failed to remove item from cart');
    console.log(response);
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
});

// Async thunk for updating item quantity
export const updateQuantityAsync = createAsyncThunk('cart/updateQuantityAsync', async (payload, { dispatch, getState }) => {
  const { itemId, quantity } = payload;
  const sessionToken = getState().session.sessionToken;
  if (!sessionToken) {
    console.error('No session token available');
    throw new Error('Session token not available');
  }
  dispatch(updateQuantity({ id: itemId, quantity }));
  dispatch(setLoading(true));
  try {
    const response = await fetch(`https://us-central1-blessedpomade.cloudfunctions.net/api/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Session-Token': sessionToken
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to update quantity');
  } catch (error) {
    console.error('Failed to update quantity:', error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
});

// Async thunk for fetching the cart from the server
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { dispatch, getState }) => {
  const sessionToken = getState().session.sessionToken;
  if (!sessionToken) {
    console.error('No session token available');
    throw new Error('Session token not available');
  }
  dispatch(setLoading(true));
  try {
    const response = await fetch('https://us-central1-blessedpomade.cloudfunctions.net/api/cart', {
      headers: {
        'Session-Token': sessionToken
      }
    });
    const data = await response.json();
    dispatch(updateCart(data.cart));
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
});