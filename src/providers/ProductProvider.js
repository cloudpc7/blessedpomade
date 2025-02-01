import { useState, useEffect } from 'react';
import ProductContext from '../ProductContext';
import { useDispatch, useSelector } from 'react-redux';
import { 
    addToCartAsync, 
    removeFromCartAsync,
    incrementCartItemAsync,
} from '../utils/cartSlice'; 
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const ProductProvider = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const cartItems = useSelector(state => state.cart.items);
    const [view, setView] = useState('product');
    const [check, setCheck] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const pomadeProductId = 'prod_RgQLpFRM5qm2WX';
    const subTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const addToCart = (event, itemData) => {
        event.preventDefault();
        const { id, product, price } = itemData;
        dispatch(addToCartAsync({
            id, 
            product, 
            price, 
            quantity: 1,
            timestamp: new Date().toISOString(),
        }));
    };

    const handleCheckout = async () => {
        const [cart] = cartItems;
        let { productId, productName, price, quantity} = cart;
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cartItems: [{
                    productId: productId,
                    productName: productName,
                    price: price,
                    quantity: quantity,
                }]
            }),
        });
    
        if (response.ok) {
            const { sessionId } = await response.json();
            const stripe = await loadStripe('pk_test_51QfVA1IMAr2rME9PThfDWjvbhpZa7fHuIQ886wVuAsFv2zHc0x04eerI4SuUjdCYtNOiiGabR1NWiDWMDPBUUSZh006svUuUYn'); 
            await stripe.redirectToCheckout({ sessionId });
        } else {
            console.error('Failed to create checkout session');
            alert('An error occurred during checkout. Please try again.');
        }
    };

    const handleIncrement = () => {
        dispatch(incrementCartItemAsync({ 
            id: pomadeProductId, 
            quantity: 1
        }));
    };

    const handleDecrement = () => {
        dispatch(removeFromCartAsync({ 
            id: pomadeProductId, 
            quantity: -1 
        }));
    };

    const goToCart = () => {
        setView('cart');
    };

    const handleGoBack = () => {
        setView('product');
    };

    const contextValue = {
        view,
        setView,
        cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        addToCart, 
        subTotal, 
        handleDecrement, 
        handleIncrement, 
        handleCheckout, 
        handleGoBack,
        check,
        setCheck,
        isProcessingPayment,
        goToCart,
        pomadeProductId,
        quantity, 
    };

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;