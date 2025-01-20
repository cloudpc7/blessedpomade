import { useEffect, useState, useRef } from 'react';

import { fetchGoogleApi, selectGoogleKey, selectIsLoading, selectErrorMsg } from '../components/googleSlice';
import { useDispatch, useSelector } from 'react-redux';
const libraries =["places"];

export const useGoogleMapsLoader = () => {
    const [addressInfo, setAddressInfo] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
    });
    const [currentAddress, setCurrentAddress] = useState(null);
    const dispatch = useDispatch();
    const googleKey = useSelector(selectGoogleKey);
    const inputRef = useRef(null); 
    useEffect(() => {
        dispatch(fetchGoogleApi());
    },[dispatch]); 

    const validateAddressWithGoogle = async (address) => {
        if (!window.google || !address) return false;
        const geocoder = new window.google.maps.Geocoder();
        return new Promise((resolve, reject) => {
            geocoder.geocode({ address }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    };

    // Handle address changes from Google Places
    const handleOnPlacesChanged = (setFieldValue) => {
        const address = inputRef.current?.getPlaces();
        if (!address || address.length === 0) return;

        const addressComponents = address[0].address_components;
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
            state: state || '',
            zip: zip || '',
        });

        setCurrentAddress(address);
    };

    // Return the necessary values
    return {
        googleKey,
        addressInfo,
        currentAddress,
        handleOnPlacesChanged,
        inputRef,
        validateAddressWithGoogle
    };
};
