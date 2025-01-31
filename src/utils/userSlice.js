import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setUser, signOut, setAuthError } from './userActions';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
const auth = getAuth();

export const writeUserToDatabase = createAsyncThunk(
    'user/writeToDatabase',
    async (_, { rejectWithValue }) => {
      try {
        const idToken = await auth.currentUser.getIdToken(true);
        const userId = auth.currentUser.uid;
        await setDoc(doc(db, "carts", userId), {
            lastUpdated: new Date(),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }     
        const data = await response.json();
        return data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        error:null,
        status: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(setUser, (state, action) => {
            state.user = action.payload;
            state.error = null;
        })
        .addCase(signOut, (state) => {
            state.user = null
        })
        .addCase(writeUserToDatabase.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(writeUserToDatabase.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.user = action.payload;
          })
          .addCase(writeUserToDatabase.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload; // Error message from rejectWithValue
          });
    }
});

export const userSliceReducer =  userSlice.reducer