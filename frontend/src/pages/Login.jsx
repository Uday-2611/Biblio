import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';

  const [currentState, setCurrentState] = useState('Login');
  const { token, loginUser, registerUser } = useContext(ShopContext);
  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === 'Sign Up') {
        await registerUser(name, email, password);
      } else {
        await loginUser(email, password);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
  }

  useEffect(() => {
    if(token) {
      navigate(from, { replace: true });
    }
  }, [token, navigate, from])

  return (
    <div className='min-h-screen w-full bg-white flex items-center justify-center py-16'>
      <div className='w-full max-w-md flex flex-col items-center bg-white rounded-2xl shadow-lg p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-5xl mb-4 text-black font-[Editorial]'>
            Page Turner
          </h1>
          <h2 className='text-2xl font-[SourceSans] text-neutral-600'>
            {currentState === 'Login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
        </div>

        <div className='w-full'>
          <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
            {currentState === 'Login' ? '' : (
              <div className='space-y-2'>
                <label className='text-sm font-medium text-neutral-600'>Name</label>
                <input 
                  onChange={(e) => setName(e.target.value)} 
                  value={name} 
                  required 
                  type="text" 
                  placeholder='Enter your name'
                  className='w-full p-3 rounded-lg border-2 border-neutral-200 focus:border-black transition-colors outline-none text-lg'
                />
              </div>
            )}

            <div className='space-y-2'>
              <label className='text-sm font-medium text-neutral-600'>Email</label>
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                type="email" 
                placeholder='Enter your email'
                className='w-full p-3 rounded-lg border-2 border-neutral-200 focus:border-black transition-colors outline-none text-lg'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-neutral-600'>Password</label>
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                type="password" 
                placeholder='Enter your password'
                className='w-full p-3 rounded-lg border-2 border-neutral-200 focus:border-black transition-colors outline-none text-lg'
              />
            </div>

            <button 
              className='bg-black text-white p-4 rounded-lg font-medium text-lg w-full mt-4 hover:bg-neutral-800 transition-colors'
            > 
              {currentState === 'Login' ? 'LOGIN' : 'SIGN UP'} 
            </button>

            {currentState === "Login" && (
              <p className='text-center text-sm text-neutral-600 hover:text-black transition-colors cursor-pointer'>
                Forgot Password?
              </p>
            )}
          </form>

          <div className='relative my-8'>
            <hr className='border-t border-neutral-200' />
            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-neutral-500 font-medium'>
              OR
            </span>
          </div>

          <button className='w-full bg-black text-white p-4 rounded-lg font-medium text-lg flex items-center justify-center gap-3 hover:bg-neutral-800 transition-colors'>
            <i className="ri-google-fill"></i>
            CONTINUE WITH GOOGLE
          </button>

          <p className='text-center mt-6 text-sm'>
            {currentState === 'Login' ? (
              <span className='text-neutral-600'>
                Don't have an account?{' '}
                <button 
                  onClick={() => setCurrentState('Sign Up')} 
                  className='text-black font-medium hover:underline'
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span className='text-neutral-600'>
                Already have an account?{' '}
                <button 
                  onClick={() => setCurrentState('Login')} 
                  className='text-black font-medium hover:underline'
                >
                  Login
                </button>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
