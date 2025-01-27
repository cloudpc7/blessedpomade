import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStripeApiKey = createAsyncThunk('stripe/fetchStripeApiKey', async () => {
    try {
        const url = '/stripe-key'; 
        const response = await fetch(url);
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

export const createPaymentIntent = createAsyncThunk('stripe/createPaymentIntent', async (amount, { rejectWithValue }) => {
    try {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
        });
    },
});

export const { cartQuantity } = stripeSlice.actions;
export const stripeReducer = stripeSlice.reducer;
export const selectStripeApiKey = (state) => state.stripe.stripeKey;
export const selectCartQuantity = (state) => state.stripe.cartCount;
export const selectClientSecret = (state) => state.stripe.clientSecret;
export const selectPaymentStatus = (state) => state.stripe.paymentStatus;
export const selectShippingAddress = (state) => state.stripe.shippingAddress;
export const selectBillingAddress = (state) => state.stripe.billingAddress;