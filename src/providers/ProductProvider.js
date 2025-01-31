import { useState, useEffect } from 'react';
import ProductContext from '../ProductContext';
import { useDispatch, useSelector } from 'react-redux';
import { 
    addToCartAsync, 
    removeFromCartAsync,
    // updateQuantityAsync,
} from '../utils/cartSlice'; 
import { useNavigate } from 'react-router-dom';

const ProductProvider = ({ children }) => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const cartItems = useSelector(state => state.cart.items);
    const [view, setView] = useState('product');
    const [check, setCheck] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const productPrice = 13.99;
    const pomadeProductId = 'prod_RgQLpFRM5qm2WX';
    const subTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    // const userId = useSelector(state => state.user.user ? state.user.user.uid : null);

    const addToCart = (event, itemData) => {
        event.preventDefault();
        console.log(itemData);
        dispatch(addToCartAsync(itemData));
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty! Please add items to proceed to checkout.');
            return;
        }
        setIsProcessingPayment(true);
        try {
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartItems }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { cartId } = await response.json();
            
            // Assuming you've integrated Stripe.js elsewhere or you'll load it here
            const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
            
            const { error } = await stripe.redirectToCheckout({ cartId });

            if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during checkout. Please try again.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleIncrement = () => {
        const item = cartItems.find(i => i.id === cartId);
        if (item) {
            const newQuantity = item.quantity + 1;
            dispatch(addToCartAsync({ id: cartId, price: 13.99, quantity: newQuantity })).then(({ cartId }) => {
                setCartId(cartId);
            });
        } else {
            console.error('Product not found in cart');
        }
    };
    
    

    // Function to switch to cart view
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
        // handleDecrement, 
        // handleIncrement, 
        handleCheckout, 
        handleGoBack,
        check,
        setCheck,
        isProcessingPayment,
        goToCart,
        pomadeProductId,
        // cartId, 
        quantity, 
        // userId,
    };

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;