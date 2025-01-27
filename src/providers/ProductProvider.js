import { useState, useEffect } from 'react';
import ProductContext from '../ProductContext';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartQuantity, cartQuantity, createPaymentIntent } from '../components/stripeSlice';
import { useNavigate } from 'react-router-dom';

const ProductProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [view, setView] = useState('product');
    const [check, setCheck] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectQuantity = useSelector(selectCartQuantity);
    const productPrice = 13.99;

    useEffect(() => {
      dispatch(cartQuantity(cartCount));
    }, [dispatch, cartCount]);

    useEffect(() => {
      const storedCartCount = localStorage.getItem('cartCount');
      if (storedCartCount) {
        setCartCount(JSON.parse(storedCartCount));
      }
    }, []);

    useEffect(() => {
      localStorage.setItem('cartCount', JSON.stringify(cartCount));
    }, [cartCount]);

    const addToCart = () => {
        setCartCount((prev) => prev + 1);
    };

    const localHandleSubmit = (e) => {
        e.preventDefault();
        handleSubmit();
    }

    const handleSubmit = async () => {
        try {
            const amountInCents = Math.round(subTotal * 100);
            await dispatch(createPaymentIntent(amountInCents)).unwrap();
            navigate('/payment');
        } catch (error) {
            console.error('Failed to create payment intent:', error);
        }
    };

    const handleGoBack = () => setView('product');

    const handleIncrement = () => {
        setCartCount(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (cartCount > 0) {
            setCartCount(prev => prev - 1);
        }
    };

    useEffect(() => {
        setSubTotal(cartCount * productPrice);
    }, [cartCount]);

    const contextValue = {
        view,
        setView,
        cartCount, 
        addToCart, 
        subTotal, 
        handleDecrement, 
        handleIncrement, 
        localHandleSubmit,
        handleGoBack,
        check,
        setCheck
    }

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
}

export default ProductProvider;