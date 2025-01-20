import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGoogleApi = createAsyncThunk('maps/fetchMaps', async() => {
    try {
        const url= 'http://localhost:5001/blessedpomade/us-central1/api/googleMaps';
        const response = await fetch(url);
        if(!response.ok) throw new Error("Failed to fetch google maps");
        const data = await response.json();
        return data.googleKey;
    } catch (error) {
        console.error("Error fetching maps:", error);
        throw error;
    }
})

const initialState = {
    google: null,
    isLoading: false,
    errMsg: '',
}


const googleMapsSlice = createSlice({
    name: 'maps',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchGoogleApi.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchGoogleApi.fulfilled, (state, action) => {
            state.isLoading = false;
            state.google = action.payload;
        })
        .addCase(fetchGoogleApi.rejected, (state, action) => {
            state.isLoading = false;
            state.errMsg = action.error.message;
        });
    },
});

export const googleMapsReducer =  googleMapsSlice.reducer;
export const selectGoogleKey = (state) => state.maps.google;
export const selectIsLoading = (state) => state.maps.isLoading;
export const selectErrorMsg = (state) => state.maps.errMsg;