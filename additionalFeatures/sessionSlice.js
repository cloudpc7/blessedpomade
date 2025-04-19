import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        sessionToken: null,
        loading: false,
        error: null,
        cart: []
    },
    reducers: {
        setSessionToken: (state, action) => {
            state.sessionToken = action.payload;
        },
        clearSessionToken: (state) => {
            state.sessionToken = null;
            state.cart = []; // Clear cart when session ends
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSessionStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSessionStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.sessionToken = action.payload;
            })
            .addCase(fetchSessionStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.sessionToken = null; // Clear token on failure
            })
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setSessionToken, clearSessionToken, setLoading, setError } = sessionSlice.actions;
export const sessionSliceReducer = sessionSlice.reducer;

// Action to fetch session status from the server
export const fetchSessionStatus = createAsyncThunk('session/fetchSessionStatus', async (_, { getState, dispatch }) => {
    try {
        const response = await fetch('https://us-central1-blessedpomade.cloudfunctions.net/api/sessions', {
            headers: {
                'Session-Token': getState().session.sessionToken
            },
            timeout: 5000 // Set a timeout for the request
        });
        const data = await response.json();
        if (data.status === "valid") {
            return getState().session.sessionToken; // Return token to confirm validity
        } else {
            throw new Error('Session invalid or expired');
        }
    } catch (error) {
        console.error('Error fetching session status:', error);
        throw error; // Re-throw for Redux Toolkit to handle
    }
}, {
    condition: (_, { getState }) => getState().session.sessionToken !== null, // Only dispatch if we have a token
});

// Fetch cart action
export const fetchCart = createAsyncThunk('session/fetchCart', async (_, { getState }) => {
    const sessionToken = getState().session.sessionToken;
    if (!sessionToken) {
        console.error('No session token available to fetch cart');
        throw new Error('Session token required to fetch cart');
    }
    try {
        const response = await fetch('https://us-central1-blessedpomade.cloudfunctions.net/api/cart', {
            headers: {
                'Session-Token': sessionToken
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch cart: ${response.statusText}`);
        }
        const data = await response.json();
        return data.cart || [];
    } catch (error) {
        console.error('Failed to fetch cart:', error);
        throw error;
    }
});