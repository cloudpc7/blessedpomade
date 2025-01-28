import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStripeApiKey = createAsyncThunk('stripe/fetchStripeApiKey', async (_, { getState, dispatch }) => {
    const state = getState();
    if (state.stripe.stripeKey) {
        return state.stripe.stripeKey; // Return cached key if available
    }

    try {
        const url = '/stripe-key'; 
        const response = await fetch(url, {
            method: 'GET',
        });
        
        if (!response.ok) {
            const text = await response.text();
            throw new Error("Failed to fetch Stripe API key");
        }
        
        const data = await response.json();
        return data.publishKey;
    } catch (error) {
        console.error("Error fetching Stripe API key:", error);
        throw error;
    }
});

let lastCreatePaymentIntentCall = 0;
export const createPaymentIntent = createAsyncThunk('stripe/createPaymentIntent', async (amount, { getState, rejectWithValue }) => {
    const now = Date.now();
    if (now - lastCreatePaymentIntentCall < 1000) { // 1 second debounce
        return;
    }
    lastCreatePaymentIntentCall = now;

    try {
        const sessionToken = getState().session.sessionToken; // Assuming you have this selector
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': sessionToken
            },
            body: JSON.stringify({ amount: amount }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to create payment intent');
        }

        const data = await response.json();
        return data.clientSecret;
    } catch (error) {
        console.error("Error creating payment intent:", error);
        return rejectWithValue(error.message);
    }
});

export const saveAddressData = createAsyncThunk(
  'stripe/saveAddressData',
  async ({ shippingAddress, billingAddress, paymentIntentId }, { getState, rejectWithValue }) => {
    try {
        const sessionToken = getState().session.sessionToken;
        const response = await fetch('/save-address', {
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
});

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
            state.error = action.error.message;
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