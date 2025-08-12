import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

const Login = () => {
    
    const {setShowLogin, axios, setToken, navigate} = useAppContext()
     
    const [state, setState] = React.useState("login");
    const [phone, setPhone] = React.useState("");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (state === "register" && !name.trim()) {
            newErrors.name = "Name is required";
        }
        
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }
        
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        
        if (state === "register" && !phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (state === "register" && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
            newErrors.phone = "Phone number must be 10 digits";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            setLoading(true);
            setErrors({});
            
            const {data} = await axios.post(`/api/user/${state}`, {name, email, password, phone})

            if (data.success) {
                navigate('/')
                setToken(data.token)
                localStorage.setItem('token', data.token)
                setShowLogin(false)
                toast.success(state === "register" ? "Account created successfully!" : "Login successful!");
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Auth error:', error);
            toast.error(error.response?.data?.message || error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

  return (
    <div onClick={()=> setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center text-sm text-gray-600 bg-black/50'>

      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <button 
                type="button"
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <img src={assets.close_icon} alt="close" className="w-4 h-4" />
            </button>
            
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input 
                        onChange={(e) => setName(e.target.value)} 
                        value={name} 
                        placeholder="Enter your full name" 
                        className={`border rounded w-full p-2 mt-1 outline-primary ${errors.name ? 'border-red-500' : 'border-gray-200'}`} 
                        type="text" 
                        disabled={loading}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    placeholder="Enter your email" 
                    className={`border rounded w-full p-2 mt-1 outline-primary ${errors.email ? 'border-red-500' : 'border-gray-200'}`} 
                    type="email" 
                    disabled={loading}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    placeholder="Enter your password" 
                    className={`border rounded w-full p-2 mt-1 outline-primary ${errors.password ? 'border-red-500' : 'border-gray-200'}`} 
                    type="password" 
                    disabled={loading}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {state === "register" && (
                <div className="w-full ">
                    <p>Phone</p>
                    <input
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                        placeholder="Enter your phone number"
                        className={`border rounded w-full p-2 mt-1 outline-primary ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                        type="tel"
                        disabled={loading}
                        required
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
            )}

            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
            <button disabled={loading} className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Please wait..." : (state === "register" ? "Create Account" : "Login")}
            </button>
        </form>
    </div>
  )
}

export default Login
