import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';

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
    loginUser: () => { },
    registerUser: () => { },
    logout: () => { },
    requireAuth: () => { },
    fetchProducts: () => { },
    sendResetCode: () => { },
    resetPassword: () => { },
    isLoading: true,
});

const ShopContextProvider = ({ children }) => {
    const requireAuth = () => {
        if (!token) {
            if (window.location.pathname !== '/login') {
                toast.error('Please login first');
                navigate('/login');
            }
            return false;
        }
        return true;
    };

    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const backendUrl = "https://pageturner-backend.onrender.com";
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
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
    }, [token]);

    useEffect(() => {
        const fetchUserData = async () => {
            const storedToken = localStorage.getItem('token');
            const storedCartItems = localStorage.getItem('cartItems');
            
            if (storedCartItems) {
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
            }
            
            if (storedToken) {
                try {
                    const response = await axios.get(`${backendUrl}/api/user/current`, {
                        headers: { token: storedToken }
                    });

                    if (response.data.success) {
                        setToken(storedToken);
                        setUser(response.data.user);
                        if (response.data.user.cartData && Object.keys(cartItems).length === 0) {
                            setCartItems(response.data.user.cartData);
                            localStorage.setItem('cartItems', JSON.stringify(response.data.user.cartData));
                        }
                    } else {
                        if (window.location.pathname !== '/login') {
                            logout();
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    if (window.location.pathname !== '/login') {
                        logout();
                    }
                }
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, [backendUrl]);

    useEffect(() => {
        const syncCart = async () => {
            if (token && user) {
                try {
                    await axios.post(`${backendUrl}/api/cart/update`,
                        { userId: user.id, cartData: cartItems },
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
    }, [cartItems, token, user]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cartItems');
        setToken('');
        setUser(null);
        setCartItems({});
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

    const sendResetCode = async (email) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
            if (response.data.success) {
                toast.success('Reset code sent to your email');
                return true;
            } else {
                toast.error(response.data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset code');
            return false;
        }
    }

    const resetPassword = async (email, code, newPassword) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
                email,
                code,
                newPassword
            });
            if (response.data.success) {
                toast.success('Password reset successfully');
                return true;
            } else {
                toast.error(response.data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
            return false;
        }
    }

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
            if (response.data.success) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('cartItems');

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setToken(response.data.token);
                setUser(response.data.user);
                setCartItems({});

                navigate('/home', { replace: true });
                window.location.href = '/home';
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    }

    const registerUser = async (name, email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
            if (response.data.success) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('cartItems');

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setToken(response.data.token);
                setUser(response.data.user);
                setCartItems({});

                navigate('/home', { replace: true });
                window.location.href = '/home';
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [window.location.pathname]);

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
        loginUser,
        registerUser,
        logout,
        requireAuth,
        fetchProducts,
        sendResetCode,
        resetPassword,
        isLoading
    }

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