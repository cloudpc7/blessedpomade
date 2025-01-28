import React from 'react';
import { useSpring, animated } from 'react-spring';

const LoadingSpinner = () => {
    const props = useSpring({
        from: { opacity: 0, scale: 0},
        to: { opacity: 1, scale: 1 },
        loop: { reverse: true },
        config: { duration: 1000 },
    });

    return (
        <animated.div
            style={{
                ...props,
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '5px solid #3498db',
                borderTop: '5px solid #3498db',
                animation: 'spin 1s linear infinite',
            }}
        />
    )
}

export default LoadingSpinner;