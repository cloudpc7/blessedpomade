import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStripeApiKey = createAsyncThunk('stripe/fetchStripeApiKey', async () => {
    try {
        const url = 'http://localhost:5001/blessedpomade/us-central1/api/gateway'; // Adjust URL as needed
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Stripe API key");
        const data = await response.json();
        return data.publishKey; // Assuming the backend returns the key in this format
    } catch (error) {
        console.error("Error fetching Stripe API key:", error);
        throw error;
    }
});

const initialState = {
    stripeKey: null,
    cartCount: 0, 
    isLoading: false,
    error: null,
}

const stripeSlice = createSlice({
    name: 'stripe',
    initialState,
    reducers: {
        setCartCount: (state, action) => {
            state.cartCount = action.payload;
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
        });
    },
});

export const { setCartCount } = stripeSlice.actions;
export const stripeReducer = stripeSlice.reducer;
// Ensure these are exported correctly
export const selectStripeApiKey = (state) => state.stripe.stripeKey;
export const selectCartCount = (state) => state.stripe.cartCount;