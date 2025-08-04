import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    // Get the current page's pathname
    const { pathname } = useLocation();

    // Use an effect to scroll to the top whenever the pathname changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // This component doesn't render any visible UI
};

export default ScrollToTop;