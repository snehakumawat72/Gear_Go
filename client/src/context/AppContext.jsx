import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

// ✅ Base URL setup
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

function AppProvider({ children }) {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cars, setCars] = useState([]);
  const [gears, setGears] = useState([]);

  // ✅ Fetch user
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/data');
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === 'owner');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Fetch cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/user/cars');
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch gears
  const fetchGears = async () => {
    try {
      const { data } = await axios.get('/api/gears/all');
      data.success ? setGears(data.gears) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common['Authorization'] = '';
    toast.success('You have been logged out');
  };

  // ✅ Get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    fetchCars();
    fetchGears();
  }, []);

  // ✅ Fetch user when token is set
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = ` Bearer ${token}`;
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    fetchGears,
    gears,
    setGears,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ✅ Hook
function useAppContext() {
  return useContext(AppContext);
}

export { AppProvider, useAppContext, AppContext };
