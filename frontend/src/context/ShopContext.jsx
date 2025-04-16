import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
    fetchProducts: () => { }, // Add fetchProducts to context value
    sendResetCode: () => { },
    resetPassword: () => { },
});

const ShopContextProvider = (props) => {
    const requireAuth = () => {
        if (!token) {
            toast.error('Please login first');
            navigate('/login');
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
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);

    // Add fetchProducts function
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

    // Call fetchProducts on mount and when token changes
    useEffect(() => {
        fetchProducts();
    }, [token]);

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setToken(response.data.token);
                setUser(response.data.user);
                navigate('/home');  // Changed from '/' to '/home'
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Login failed');
        }
    }

    const registerUser = async (name, email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
            if (response.data.success) {
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                setToken(response.data.token);
                setUser(response.data.user);
                navigate('/home');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    }

    

    // Update login effect
    useEffect(() => {
        const fetchUserData = async () => {
            const storedToken = localStorage.getItem('token');
            const storedCartItems = localStorage.getItem('cartItems');
            
            // Restore cart from localStorage first
            if (storedCartItems) {
                setCartItems(JSON.parse(storedCartItems));
            }
            
            if (storedToken) {
                try {
                    const response = await axios.get(`${backendUrl}/api/user/current`, {
                        headers: { token: storedToken }
                    });

                    if (response.data.success) {
                        setToken(storedToken);
                        setUser(response.data.user);
                        // Only update cart if there's server data and no local cart
                        if (response.data.user.cartData && Object.keys(JSON.parse(storedCartItems || '{}')).length === 0) {
                            setCartItems(response.data.user.cartData);
                        }
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    logout();
                }
            }
        };

        fetchUserData();
    }, [backendUrl]);

    // Sync cart with backend whenever it changes
    useEffect(() => {
        const syncCart = async () => {
            if (token && user) {
                try {
                    await axios.post(`${backendUrl}/api/cart/update`, 
                        { userId: user.id, cartData: cartItems },
                        { headers: { token } }
                    );
                    // Also save to localStorage as backup
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                } catch (error) {
                    console.error('Error syncing cart:', error);
                }
            } else {
                // If not logged in, at least save to localStorage
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        };
        syncCart();
    }, [cartItems, token, user]);

    // Update logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Add this line
        localStorage.removeItem('cartItems'); // Add this line
        setToken('');
        setUser(null);
        setCartItems({});
        navigate('/login');
    };

    const addToCart = (itemId, quantity = 1) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + quantity
        }));
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            const newCart = { ...cartItems };
            delete newCart[itemId];
            setCartItems(newCart);
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: newQuantity }));
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
            console.log(error);
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
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to reset password');
            return false;
        }
    }

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
        fetchProducts, // Add fetchProducts to context value
        sendResetCode,
        resetPassword,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;