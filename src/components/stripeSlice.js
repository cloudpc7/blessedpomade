import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStripeApiKey = createAsyncThunk('stripe/fetchStripeApiKey', async (_, { getState, rejectWithValue }) => {
  const { session } = getState();
  const sessionToken = session.sessionToken;
  console.log(sessionToken);
  if (!sessionToken) {
    return rejectWithValue('Session token required for fetching Stripe key');
  }

  try {
    const response = await fetch('https://us-central1-blessedpomade.cloudfunctions.net/api/stripe-key', {
      method: 'GET',
      headers: {
        'Session-Token': sessionToken
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch Stripe API key");
    }
    
    const data = await response.json();
    console.log(data);
    return data.publishKey;
  } catch (error) {
    console.error("Error fetching Stripe API key:", error);
    return rejectWithValue(error.message || 'An error occurred');
  }
});

export const createPaymentIntent = createAsyncThunk('https://us-central1-blessedpomade.cloudfunctions.net/api/create-payment-intent', async (amount, { getState, rejectWithValue }) => {
  const { session } = getState();
  const sessionToken = session.sessionToken;
  console.log(sessionToken);
  if (!sessionToken) {
    return rejectWithValue('Session token required for creating payment intent');
  }

  try {
    const response = await fetch('https://us-central1-blessedpomade.cloudfunctions.net/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Session-Token': sessionToken
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }
    
    const data = await response.json();
    console.log(data);
    return data.clientSecret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return rejectWithValue(error.message);
  }
});

export const saveAddressData = createAsyncThunk(
  'stripe/saveAddressData',
  async ({ shippingAddress, billingAddress, paymentIntentId }, { getState, rejectWithValue }) => {
    const { session } = getState();
    const sessionToken = session.sessionToken;

    if (!sessionToken) {
      return rejectWithValue('Session token required for saving address data');
    }

    try {
      const response = await fetch('https://us-central1-blessedpomade.cloudfunctions.net/api/save-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Session-Token': sessionToken
        },
        body: JSON.stringify({ shippingAddress, billingAddress, paymentIntentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save address data');
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving address data:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  stripeKey: null,
  cartCount: 0, 
  isLoading: false,
  error: null,
  clientSecret: null,
  paymentStatus: 'idle',
  shippingAddress: null,
  billingAddress: null,
}

const stripeSlice = createSlice({
  name: 'stripe',
  initialState,
  reducers: {
    cartQuantity: (state, action) => {
      state.cartCount = action.payload;
    },
    updateShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    updateBillingAddress: (state, action) => {
      state.billingAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStripeApiKey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStripeApiKey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stripeKey = action.payload;
      })
      .addCase(fetchStripeApiKey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Changed from action.error.message to action.payload
      })
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.paymentStatus = 'loading';
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientSecret = action.payload;
        state.paymentStatus = 'ready';
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.paymentStatus = 'error';
      })
      .addCase(saveAddressData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveAddressData.fulfilled, (state) => {
        state.isLoading = false;
        // Optionally update state here if needed
      })
      .addCase(saveAddressData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { cartQuantity, updateShippingAddress, updateBillingAddress } = stripeSlice.actions;
export const stripeReducer = stripeSlice.reducer;
export const selectStripeApiKey = (state) => state.stripe.stripeKey;
export const selectCartQuantity = (state) => state.stripe.cartCount;
export const selectClientSecret = (state) => state.stripe.clientSecret;
export const selectPaymentStatus = (state) => state.stripe.paymentStatus;
export const selectShippingAddress = (state) => state.stripe.shippingAddress;
export const selectBillingAddress = (state) => state.stripe.billingAddress;