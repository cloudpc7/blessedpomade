import { useNavigate } from 'react-router-dom';
import { useState} from 'react';

export const useTransactionManager = () => {
    const [ transaction, setTransaction ] = useState(null);
    const navigate = useNavigate();

    const transactionId = () => {
            const timestamp = Date.now();
            const randomPart = Math.random().toString(36).substr(2, 9);
            return `txn_${timestamp}_${randomPart}`;
    };

    const getCurrentDateTime = () => {
        const date = new Date();
        return date.toISOString();
    }

    const prepareTransaction = (values, quantity, subTotal, finalAmount) => {
        const newTransaction = {
            transactionId: transactionId(),
            customer : {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                shippingInformation: {
                    street: values.street,
                    city: values.city,
                    state: values.state,
                    zip: values.zip,
                    country: "USA",
                },
                products: [
                    {
                        prdouctName: "blessedpomade",
                        quantity: quantity,
                        pricePerUnit: 13.99,
                    }
                ],
                cost : {
                    totalAmount: subTotal,
                    taxes: 0.0725,
                    shippingCost: 0.00,
                    discount: 0.00,
                    finalAmount: finalAmount,
                    transactionDate: getCurrentDateTime(),
                    paymentMethod: '',
                    paymentStatus: '',
                    orderStatus: '',
                }
            }
        }
        setTransaction(newTransaction);
        navigate('/checkout');
    }
    return {prepareTransaction, transaction};
};