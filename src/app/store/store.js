import { configureStore } from '@reduxjs/toolkit';
import { pomoadeTransactionsReducer } from '../../components/pomadeSlice';

export const store  = configureStore({
    reducer: {
        transactions: pomoadeTransactionsReducer,
    }
})