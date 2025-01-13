import { useState, useRef, useEffect } from 'react'
import useGoogleMapsLoader from '../utils/AddressApi';
import ProductContext from '../ProductContext';
import { transactionId } from '../transaction';

const validateAddressWithGoogle = async (address) => {
    if(!window.google || !address) return false;
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
            if(status === window.google.maps.GeocoderStatus.OK) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

const ProductProvider = ({ children }) => {

    const productDetail = "";
    let productTotal = 13.99;
    const [quantity, setQuantity] = useState(0);
    const [ count, setCount ] = useState(1);
    const [getCart, setGetCart] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [subTotal, setSubTotal] = useState(productTotal);
    const [isValid, setIsValid] = useState(true);
    const [streetAddress, setStreetAddress] = useState('');
    const handleModal = () => setShowModal((prev) => !prev);
    const handleClose = () => {
        setCount(1);
        setQuantity(0);
        setShowModal(false); 
        setShowModal(false); 
        setGetCart(false);
        setAddressInfo({
            street: '',
            city: '',
            state: '',
            zip: '', 
        })
    };
    const handleDecrement = () => {
        setCount((prev) => Math.max(1, prev - 1));
    }
    const handleIncrement = () => {
        setCount(prev => prev + 1);
    }

    const handleCount = (e) => {
        setCount((prev) => Math.max(1,Number(e.target.value)));
    };

    const handleCheckOut = () => {
        setGetCart((prev) => !prev);
        setQuantity(count);
    }
    const addToCart = () => {
        setQuantity(count);
    }

    useEffect(() => {
        setQuantity(count);
        setSubTotal(productTotal * quantity);
    },[count, quantity]);
    let finalAmount = subTotal * 0.0725 + subTotal;
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem("count");
            localStorage.removeItem("quantity");
            localStorage.removeItem("subTotal");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
    });

    const [currentAddress, setCurrentAddress] = useState([]);
    const inputRef = useRef(null);
    const { isLoaded, loadError } = useGoogleMapsLoader();

    if(loadError) {
        console.error('Google Maps Api failed to load:', loadError);
    }

    const [addressInfo, setAddressInfo] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
    });

    const getCurrentDateTime = () => {
        const date = new Date();
        return date.toISOString();
    }


    const handleSubmit = async (values) => {
        const validAddress = await validateAddressWithGoogle(values.street);
        if(!validAddress) setIsValid(false);
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
                        productId: transactionId(),
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

        console.log(newTransaction);
    }



    const handleOnPlacesChanged = (setFieldValue) => {
        const address = inputRef.current?.getPlaces();
        if(!address || address.length === 0) return; 
        // Extract address components
        const addressComponents = address[0].address_components;

        // Extracting street, city, state, and zip from address components
        const street = `${addressComponents[0]?.short_name} ${addressComponents[1]?.short_name}`;
        const city = addressComponents.find(component => component.types.includes('locality'))?.short_name || '';
        const state = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.short_name || '';
        const zip = addressComponents.find(component => component.types.includes('postal_code'))?.short_name || '';

        setFieldValue('street', street);
        setFieldValue('city', city);
        setFieldValue('state', state);
        setFieldValue('zip', zip);
        setAddressInfo({
            street: street || '',
            city: city || '',
            state: state || '' ,
            zip: zip || '',
        });

        if (inputRef.current) {
            inputRef.current.value = street;
        }
        setCurrentAddress(address);
    };

    const contextValue = {
        quantity,
        count,
        showModal,
        getCart,
        subTotal,
        productDetail,
        productTotal,
        currentAddress,
        addressInfo,
        isLoaded,
        inputRef,
        isValid,
        setIsValid,
        addToCart,
        handleDecrement,
        handleIncrement,
        handleCheckOut,
        handleModal,
        handleClose,
        handleSubmit,
        handleCount,
        handleOnPlacesChanged,
        validateAddressWithGoogle,
    }

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
}

export default ProductProvider;