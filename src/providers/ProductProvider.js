import { useState, useEffect } from 'react';
import ProductContext from '../ProductContext';
import { useDispatch, useSelector } from 'react-redux';
import { 
    addToCartAsync, 
    removeFromCartAsync,
    incrementCartItemAsync,
} from '../utils/cartSlice'; 
import { loadStripe } from '@stripe/stripe-js';

const ProductProvider = ({ children }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const [view, setView] = useState('product');
    const [check, setCheck] = useState(false);
    const [stripePromise, setStripePromise] = useState(null);
    const pomadeProductId = 'prod_RgQLpFRM5qm2WX';
    const [subTotal, setSubTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        setStripePromise(loadStripe('pk_test_51QfVA1IMAr2rME9PThfDWjvbhpZa7fHuIQ886wVuAsFv2zHc0x04eerI4SuUjdCYtNOiiGabR1NWiDWMDPBUUSZh006svUuUYn'));
    }, []);

    useEffect(() => {
        const newSubTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const newCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setSubTotal(newSubTotal);
        setCartCount(newCartCount);
    }, [cartItems]);

    const addToCart = (event, itemData) => {
        event.preventDefault();
        const { id, product, price } = itemData;
        const existingItem = cartItems.find(item => item.id === id);
    
        if (existingItem) {
            // If item exists, increase its quantity
            dispatch(incrementCartItemAsync({
                id: id,
                quantity: 1  // Increment by 1 since we want to add one more to the cart
            }));
        } else {
            // If it's a new item, add it to the cart
            dispatch(addToCartAsync({
                id, 
                product, 
                price, 
                quantity: 1,
                timestamp: new Date().toISOString(),
            }));
        }
    };

    const handleCheckout = async () => {
        const cart = cartItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
        }));
    
        console.log(cart);
        try {
            const response = await fetch('https://us-central1-blessedpomade.cloudfunctions.net/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems: cart
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Checkout session response:', data);

            // Client handles the redirect
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No URL returned from server');
                alert('Failed to initiate checkout. No URL received.');
            }
    
        } catch (error) {
            console.error('Checkout error:', error);
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
        cartCount,
        addToCart, 
        subTotal, 
        handleDecrement, 
        handleIncrement, 
        handleCheckout, 
        handleGoBack,
        check,
        setCheck,
        goToCart,
        pomadeProductId,
    };

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;