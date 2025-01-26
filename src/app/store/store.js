import { configureStore } from '@reduxjs/toolkit';
import { pomadeTransactionsReducer } from '../../components/pomadeSlice';
import { googleMapsReducer } from '../../components/googleSlice';
import { stripeReducer } from '../../components/stripeSlice';
export const store  = configureStore({
    reducer: {
        transactions: pomadeTransactionsReducer,
        maps: googleMapsReducer,
        stripe: stripeReducer,
    }
})