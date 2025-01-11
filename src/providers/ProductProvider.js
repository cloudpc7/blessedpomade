import { useState, useEffect, useRef } from 'react'
import useGoogleMapsLoader from '../utils/AddressApi';
import ProductContext from '../ProductContext';

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
const ProductProvider = ({children}) => {

    const [quantity, setQuantity] =  useState(0);
    const handleDecrement = () => setQuantity((prev) => prev--);
    const handleIncrement = () => setQuantity((prev) => prev++);
    const [currentAddress, setCurrentAddress] = useState([]);
    const inputRef = useRef(null);
    const { isLoaded, loadError } = useGoogleMapsLoader();
    const [price, setPrice ] = useState(0);

    if(loadError) {
        console.error('Google Maps Api failed to load:', loadError);
    }

    const [addressInfo, setAddressInfo] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
    });


    const handleSubmit = (values) => {
        console.log(values);
    }

    const handleOnPlacesChanged = (setFieldValue) => {
        const address = inputRef.current.getPlaces();

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
        // Update address info state
        setAddressInfo({
            street: street || '',
            city: city || '',
            state: state || '',
            zip: zip || '',
        });

        if (inputRef.current) {
            inputRef.current.value = street;
        }
        setCurrentAddress(address);
    };

    const contextValue = {
        quantity,
        price,
        currentAddress,
        addressInfo,
        isLoaded,
        inputRef,
        handleDecrement,
        handleIncrement,
        handleSubmit,
        handleOnPlacesChanged,
        validateAddressWithGoogle
    }

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
}

export default ProductProvider;