import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        sessionToken: null,
        loading: false,
    },
    reducers: {
        setSessionToken: (state, action) => {
            state.sessionToken = action.payload;
        },
        clearSessionToken: (state) => {
            state.sessionToken = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setSessionToken, clearSessionToken, setLoading } = sessionSlice.actions;
export const sessionSliceReducer = sessionSlice.reducer;