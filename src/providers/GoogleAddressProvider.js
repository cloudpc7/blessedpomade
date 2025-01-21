// import React, { useEffect, useState } from 'react';
// import AddressContext from "../AddressContext";
// import { useGoogleMapsLoader } from '../utils/GoogleAddress';
// import { useJsApiLoader } from '@react-google-maps/api';

// const GoogleAddressProvider = ({children}) => {
//     const [isValid, setIsValid] = useState(false);
//     const { 
//         inputRef, 
//         addressInfo, 
//         currentAddress,
//         googleKey,
//         handleOnPlacesChanged,
//         validateAddressWithGoogle,
//     } = useGoogleMapsLoader();

//     const contextValue = {
//         inputRef,
//         addressInfo,
//         currentAddress,
//         googleKey,
//         handleOnPlacesChanged,
//         isValid,
//         setIsValid,
//         validateAddressWithGoogle
//     };

//     return (
//         <AddressContext.Provider value={contextValue}>
//             {children}
//         </AddressContext.Provider>
//     );
// }

// export default GoogleAddressProvider;
