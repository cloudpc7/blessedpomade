import {  useJsApiLoader } from '@react-google-maps/api';
import config from '../config';


const libraries = ['places'];
const useGoogleMapsLoader = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-scripts',
        googleMapsApiKey: config.apiKey,
        libraries,
        version: 'weekly',
    });
    return { isLoaded, loadError };
};

export default useGoogleMapsLoader;
