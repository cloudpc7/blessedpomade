// emailSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust path as needed

export const sendEmail = createAsyncThunk(
    'email/sendEmail',
    async ({ to, subject, message }, { rejectWithValue }) => {
        try {
            await addDoc(collection(db, "mail"), {
                to: to,
                message: {
                    subject: subject,
                    html: message
                }
            });
            return { success: true };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const emailSlice = createSlice({
    name: 'email',
    initialState: {
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendEmail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(sendEmail.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(sendEmail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default emailSlice.reducer;