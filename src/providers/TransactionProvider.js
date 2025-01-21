// import TransactionContext from "../TransactionContext";
// import { useDispatch } from 'react-redux';
// import { fetchTransactions, postPomadeTransactions } from '../components/pomadeSlice';
// import { useEffect } from 'react';
// import { useTransactionManager } from "../utils/transactionManager";
// const TransactionProvider = ({children}) => {
//     const { transaction } = useTransactionManager;
//     const dispatch = useDispatch();

//     const fetchData = async () => {
//         dispatch(fetchTransactions());
//     };
    
//     const addTransaction = async (transactionData) => {
//         dispatch(postPomadeTransactions(transactionData));
//     };

//     useEffect(() => {
//         fetchData();
//     },[]);

//     const contextValue = {
//         fetchData,
//         addTransaction,
//         transaction,
//         postPomadeTransactions,
//     }
//     return (
//         <TransactionContext.Provider value={contextValue}>
//             {children}
//         </TransactionContext.Provider>
//     );
// };

// export default TransactionProvider;