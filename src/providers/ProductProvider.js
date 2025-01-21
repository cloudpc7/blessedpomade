import { useState, useEffect } from 'react';
import ProductContext from '../ProductContext';
// import { FormValidation }from '../utils/formValidation';
const ProductProvider = ({ children }) => {
    // const { handleSubmit } = FormValidation();

    // open pomade product modal in hero section 

    // const [quantity, setQuantity] = useState(null);
    // const [ count, setCount ] = useState(0);
    // const [getCart, setGetCart] = useState(false);
    // const [subTotal, setSubTotal] = useState(productTotal);
    // const [isValid, setIsValid] = useState(true);

    
    // const handleClose = () => {
    //     setCount(1);
    //     setQuantity();
    //     setShowModal(false); 
    //     setShowModal(false); 
    //     setGetCart(false);
    // };

    // const handleDecrement = () => {
    //     setCount((prev) => Math.max(1, prev - 1));
    // }
    // const handleIncrement = () => {
    //     setCount(prev => prev + 1);
    // }

    // const handleCount = (e) => {
    //     setCount((prev) => Math.max(1,Number(e.target.value)));
    // };

    // const handleCheckOut = () => {
    //     setGetCart((prev) => !prev);
    //     setQuantity();
    // }

    // const addToCart = () => {
    // };

    // useEffect(() => {
    //     setQuantity(null);
    //     setSubTotal(productTotal * quantity);
    // },[count, quantity]);
    // let finalAmount = subTotal * 0.0725 + subTotal;

    // useEffect(() => {
    //     const handleBeforeUnload = () => {
    //         localStorage.removeItem("count");
    //         localStorage.removeItem("quantity");
    //         localStorage.removeItem("subTotal");
    //     };

    //     window.addEventListener("beforeunload", handleBeforeUnload);
    // });

    const contextValue = {
        // quantity,
        // finalAmount,
        // count,
        
        // getCart,
        // subTotal,
        // productDetail,
        // productTotal,
        // isValid,
        // setIsValid,
        // addToCart,
        // handleDecrement,
        // handleIncrement,
        // handleCheckOut,
        // handleClose,
        // handleSubmit,
        // handleCount,
    }

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
}

export default ProductProvider;