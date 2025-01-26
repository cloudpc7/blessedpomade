import { useState, useEffect } from 'react';
import ProductContext from '../ProductContext';
import { useNavigate } from 'react-router-dom';
// import { FormValidation }from '../utils/formValidation';
const ProductProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [view, setView] = useState('product');
    const [check, setCheck] = useState(false);
    const productPrice = 13.99;
   
    const addToCart = () => {
        setCartCount((prev) => prev + 1);
      };

      const localHandleSubmit = () => {
        if (cartCount > 0) {
            handleSubmit();
        } else {
            alert('Your cart is empty!');
        }
      }
    
      const handleSubmit = () => {
        console.log("checkout submitted");
      };
    
      const handleGoBack = () => setView('product');
    
      // Function to increase cart count
      const handleIncrement = () => {
        setCartCount(prev => prev + 1);
      };
    
      // Function to decrease cart count
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