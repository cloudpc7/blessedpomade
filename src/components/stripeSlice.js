import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStripeApi = createAsyncThunk('stripe/fetchstripe', async() => {
    try {
        const url= 'http://localhost:5001/blessedpomade/us-central1/api/gateway';
        const response = await fetch(url);
        if(!response.ok) throw new Error("Failed to fetch stripe api");
        const data = await response.json();
        return data.publishKey;
    } catch (error) {
        console.error("Error fetching Stripe API:", error);
        throw error;
    }
});

export const postClientSecret = createAsyncThunk('stripe/fetchClientSecret', async(amount = 1000) => {
    try {
       const url = "http://localhost:5001/blessedpomade/us-central1/api/createpaymentintent"
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ amount })
        });
        if(!response.ok) throw new Error("Failed to fetch stripe api");
        const data = await response.json();
        return data.clientSecret;
    } catch (error) {
        console.error("Failed to fetch client secret:", error);
    }
});

const initialState = {
    stripe: null,
    clientSecret: null,
    isLoading: false,
    errMsg: '',
}


const stripeSlice = createSlice({
    name: 'stripeApi',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchStripeApi.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchStripeApi.fulfilled, (state, action) => {
            state.isLoading = false;
            state.stripe = action.payload;
        })
        .addCase(fetchStripeApi.rejected, (state, action) => {
            state.isLoading = false;
            state.errMsg = action.error.message;
        })
        .addCase(postClientSecret.pending, (state) => {
            state.isLoading = true;
        })

        .addCase(postClientSecret.fulfilled, (state, action) => {
            state.isLoading = false;
            state.clientSecret = action.payload;
        })

        .addCase(postClientSecret.rejected, (state, action) => {
            state.isLoading = false;
            state.errMsg = action.error.message;
        });
    },
});

export const stripeApiReducer =  stripeSlice.reducer;
export const selectClientSecret = (state) => state.stripeApi.clientSecret;
export const selectStripeApiKey = (state) => state.stripeApi.stripe;
