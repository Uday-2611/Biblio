import axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

export const ShopContext = createContext({
    products: [],
    currency: '$',
    delivery_fee: 10,
    search: '',
    setSearch: () => { },
    showSearch: false,
    setShowSearch: () => { },
    cartItems: {},
    setCartItems: () => { },
    addToCart: () => { },
    getCartCount: () => 0,
    updateQuantity: () => { },
    getCartAmount: () => 0,
    navigate: () => { },
    backendUrl: '',
    token: '',
    setToken: () => { },
    user: null,
    setUser: () => { },
    logout: () => { },
    requireAuth: () => false,
    fetchProducts: () => { },
    isLoading: true,
});

const ShopContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const backendUrl = 'https://pageturner-backend.onrender.com';
    const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth();
    const { signOut } = useClerk();

    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const initialCartLoadedRef = useRef(false);

    const requireAuth = () => {
        if (!isSignedIn) {
            if (window.location.pathname !== '/login') {
                toast.error('Please login first');
                navigate('/login');
            }
            return false;
        }
        return true;
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (!storedCartItems) {
            return;
        }

        try {
            const parsedCart = JSON.parse(storedCartItems);
            if (Object.keys(parsedCart).length === 0) {
                localStorage.removeItem('cartItems');
                setCartItems({});
            } else {
                setCartItems(parsedCart);
            }
        } catch {
            localStorage.removeItem('cartItems');
            setCartItems({});
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!authLoaded) {
                return;
            }

            if (!isSignedIn) {
                setToken('');
                setUser(null);
                initialCartLoadedRef.current = false;
                setIsLoading(false);
                return;
            }

            try {
                const sessionToken = await getToken();
                if (!sessionToken) {
                    setToken('');
                    setUser(null);
                    setIsLoading(false);
                    return;
                }

                setToken(sessionToken);

                const response = await axios.get(`${backendUrl}/api/user/current`, {
                    headers: { token: sessionToken }
                });

                if (response.data.success) {
                    setUser(response.data.user);

                    if (response.data.user.cartData && !initialCartLoadedRef.current) {
                        initialCartLoadedRef.current = true;
                        setCartItems(response.data.user.cartData);
                        localStorage.setItem('cartItems', JSON.stringify(response.data.user.cartData));
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [authLoaded, isSignedIn, backendUrl]);

    useEffect(() => {
        const syncCart = async () => {
            if (isSignedIn && token && user) {
                try {
                    await axios.post(
                        `${backendUrl}/api/cart/update`,
                        { cartData: cartItems },
                        { headers: { token } }
                    );
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                } catch (error) {
                    console.error('Error syncing cart:', error);
                }
            } else {
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        };

        syncCart();
    }, [cartItems, token, user, isSignedIn, backendUrl]);

    const logout = async () => {
        localStorage.removeItem('cartItems');
        setToken('');
        setUser(null);
        setCartItems({});
        await signOut();

        if (window.location.pathname !== '/login') {
            navigate('/login');
        }
    };

    const addToCart = (itemId, quantity = 1) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + quantity
        }));
    };

    const getCartCount = () => {
        const count = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
        return count > 0 ? count : 0;
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            const newCart = { ...cartItems };
            delete newCart[itemId];
            setCartItems(newCart);
            localStorage.setItem('cartItems', JSON.stringify(newCart));
        } else {
            const newCart = { ...cartItems, [itemId]: newQuantity };
            setCartItems(newCart);
            localStorage.setItem('cartItems', JSON.stringify(newCart));
        }
    };

    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            const item = products.find((product) => product._id === itemId);
            return total + (item?.price || 0) * quantity;
        }, 0);
    };

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        user,
        setUser,
        logout,
        requireAuth,
        fetchProducts,
        isLoading
    };

    if (isLoading) {
        return null;
    }

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default ShopContextProvider;
