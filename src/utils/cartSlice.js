import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    count: 0,
    total: 0,
    loading: false,
    error: null,
    checkoutSession:null,
    stripePublishableKey:null,
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
    setCheckoutSession: (state,action) => {
      state.checkoutSession = action.payload;
    },
    setStripePublishableKey: (state, action) => {
      state.stripePublishableKey = action.payload;
    }
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  setLoading, 
  setError, 
  updateCart, 
  setCheckoutSession,
  setStripePublishableKey,
} = cartSlice.actions;
export const cartSliceReducer = cartSlice.reducer;

export const fetchStripePublishableKey = createAsyncThunk(
  'cart/fetchStripePublishableKey',
  async (_, { dispatch }) => {
    try {
      const response = await fetch('/stripe-publishable-key'); // Assuming you renamed the endpoint accordingly
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response not OK:', errorText);
        throw new Error(errorText || 'Failed to fetch Stripe publishable key');
      }

      const { publishableKey } = await response.json();
      dispatch(setStripePublishableKey(publishableKey));
      return publishableKey;
    } catch (error) {
      console.error('Error fetching Stripe publishable key:', error);
      dispatch(setError(error.message)); 
      throw error;
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (payload, { dispatch, getState }) => {
    dispatch(setLoading(true));
    const { id, product, price, quantity } = payload;
    const userId = getState().user.user ? getState().user.user.uid : null;

    if (!userId) {
      console.error('User ID not available. Please log in or create an account.');
      dispatch(setError('User ID not available. Please log in or create an account.'));
      throw new Error('No user ID available');
    }

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
      const response = await fetch(`/update-cart-item/${userId}/${id}`, {
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
      const response = await fetch(`/update-cart-item/${userId}/${id}`, {
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
      dispatch(updateCart(result.cart)); // Update the cart with the new data from the server
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

export const createCheckoutSessionAsync = createAsyncThunk(
  'cart/createCheckoutSessionAsync',
  async (_, { dispatch, getState }) => {
    dispatch(setLoading(true));
    const userId = getState().user.user ? getState().user.user.uid : null;
    const cartItems = getState().cart.items; 
    console.log(userId, cartItems);
    if (!userId) {
      console.error('User ID not available. Please log in or create an account.');
      dispatch(setError('User ID not available. Please log in or create an account.'));
      throw new Error('No user ID available');
    }

    try {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response not OK:', errorText);
        throw new Error(errorText || 'Failed to create checkout session');
      }
      const { sessionId } = await response.json(); // Assuming the response contains sessionId
      dispatch(setCheckoutSession(sessionId)); // Set the checkout session ID in the state
      return sessionId;
    } catch (error) {
      console.error('Error in createCheckoutSessionAsync:', error);
      dispatch(setError(error.message)); 
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);