// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { collection, getDocs, addDoc } from 'firebase/firestore';

// export const fetchTransactions = createAsyncThunk('cart/fetchTransactions', async() => {
//     try {
//         const url= 'http://localhost:5001/blessedpomade/us-central1/api/transactions';
//         const response = await fetch(url);
//         if(!response.ok) throw new Error("Failed to fetch transactions");
//         return await response.json();
//     } catch (error) {
//         console.error("Error fetching transactions:", error);
//         throw error;
//     }
// })

// export const postPomadeTransactions = createAsyncThunk('cart/postTransactions', async(transactionData) => {
//     try {
//         const url= 'http://localhost:5001/blessedpomade/us-central1/api/addTransaction';
//         const response = await fetch(url,{
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(transactionData),
//         });

//         if(!response.ok) throw new Error("Failed to add transaction");
//         return await response.json();
//     } catch (error) {
//         console.error("Error fetching transactions:", error);
//         throw error;
//     }
// })

// const initialState = {
//     pomadeTransactions : [],
//     isLoading: false,
//     errMsg: ''
// };

// const transactionsSlice = createSlice({
//     name: 'transactions',
//     initialState,
//     reducers: {
//         addTransaction: (state, action) => {
//             const newTransaction = {
//                 id: state.pomadeTransactions.length + 1,
//                 ...action.payload
//             };
//             state.pomadeTransactions.push();
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//         .addCase(fetchTransactions.pending, (state) => {
//             state.isLoading = true;
//         })
//         .addCase(fetchTransactions.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.errMsg = '';
//             state.pomadeTransactions = action.payload;
//         })
//         .addCase(fetchTransactions.rejected, (state, action) => {
//             state.isLoading = false;
//             state.errMsg = action.error ? action.error.message : 'Fetch failed';
//         })
//         .addCase(postPomadeTransactions.fulfilled, (state, action) => {
//             state.pomadeTransactions = [...state.pomadeTransactions, action.payload];
//         })
//         .addCase(postPomadeTransactions.rejected, (state, action) => {
//             alert(
//                 'Unable to complete transaction\nErrors:' +
//                 (action.error ? action.error.message : 'Post failed')
//             );
//         });
//     }
// });

// export const pomadeTransactionsReducer =  transactionsSlice.reducer;
// export const { addTransaction } = transactionsSlice.actions;
// export const transactions = (state) => {
//     return state.transations.pomadeTransactions;
// }