import { useState, useEffect } from 'react';
import ProductContext from '../ProductContext';
import { useDispatch, useSelector } from 'react-redux';
import { 
    addToCart as addToCartAction, 
    removeFromCart as removeFromCartAction, 
    updateQuantity as updateQuantityAction, 
    updateQuantityAsync,
    addToCartAsync,
    removeFromCartAsync,
    fetchCart
} from '../utils/cartSlice'; 
import { useNavigate } from 'react-router-dom';
import { createPaymentIntent, fetchStripeApiKey } from '../components/stripeSlice';

const ProductProvider = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Use Redux state instead of local state
    const cartCount = useSelector(state => state.cart.count);
    const cartItems = useSelector(state => state.cart.items);
    const [view, setView] = useState('product');
    const [check, setCheck] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false); // New state to track payment processing
    const productPrice = 13.99;
    const sessionToken = useSelector(state => state.session.sessionToken);
    // Calculate subtotal based on cart items
    const subTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log(sessionToken);

    useEffect(() => {
        if(sessionToken) {
            dispatch(fetchCart()).catch(error => {
                console.error('Error fetching cart:', error);
            })
        }
        // Ensure fetchCart is not called twice if sessionToken exists
        else {
            dispatch(fetchCart());
        }
    }, [dispatch, sessionToken]);

    const addToCart = (event, itemData) => {
        event.preventDefault();
        const payload = {
            item: itemData,
            sessionToken: sessionToken
        };
        dispatch(addToCartAction(itemData)); // Dispatch the item data to Redux
        dispatch(addToCartAsync(payload));  // Sync with backend
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isProcessingPayment) return; // Prevent multiple submissions
        setIsProcessingPayment(true); // Set processing flag
        
        try {
            // Fetch Stripe key first
            await dispatch(fetchStripeApiKey()).unwrap();
            const amountInCents = Math.round(subTotal * 100);
            await dispatch(createPaymentIntent(amountInCents)).unwrap();
            navigate('/payment');
        } catch (error) {
            console.error('Payment process error:', error);
        } finally {
            setIsProcessingPayment(false); // Reset processing flag
        }
    };

    const handleIncrement = (itemId) => {
        const item = cartItems.find(i => i.id === itemId);
        if (item) {
            const newQuantity = item.quantity + 1;
            dispatch(updateQuantityAction({ id: itemId, quantity: newQuantity }));
            dispatch(updateQuantityAsync({ itemId: itemId, quantity: newQuantity }));  // Pass object with itemId and quantity
        } else {
            console.error('Item not found in cart:', itemId);
        }
    };
    
    const handleDecrement = (itemId) => {
        const item = cartItems.find(i => i.id === itemId);
        if (item) {
            if (item.quantity > 1) {
                const newQuantity = item.quantity - 1;
                dispatch(updateQuantityAction({ id: itemId, quantity: newQuantity }));
                dispatch(updateQuantityAsync({ itemId: itemId, quantity: newQuantity }));  // Pass object with itemId and quantity
            } else if (item.quantity === 1) {
                dispatch(removeFromCartAction(itemId));
                dispatch(removeFromCartAsync(itemId));  // This already takes only itemId
            }
        } else {
            console.error('Item not found in cart:', itemId);
        }
    };

    const handleGoBack = () => setView('product');

    const contextValue = {
        view,
        setView,
        cartCount, 
        addToCart, 
        subTotal, 
        handleDecrement, 
        handleIncrement, 
        handleSubmit,
        handleGoBack,
        check,
        setCheck,
        isProcessingPayment // Optionally expose this if needed in child components
    };

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;