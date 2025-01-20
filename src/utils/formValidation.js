import { useState, useEFfect } from 'react';
import { useContext } from 'react';
import AddressContext from '../AddressContext';
import { useTransactionManager } from './transactionManager';

export const FormValidation = () => {
    const { validateAddressWithGoogle }= useContext(AddressContext);
    const { prepareTransaction } = useTransactionManager();
    const handleSubmit = async (values, setIsValid, quantity,subTotal, finalAmount) => {
        const validAddress = await validateAddressWithGoogle(values.street);
        if(!validAddress) setIsValid(false); 
        prepareTransaction(values, quantity, subTotal, finalAmount);
    }
    return {
        handleSubmit,
    }
}