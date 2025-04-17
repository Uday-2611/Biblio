import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';

  const [currentState, setCurrentState] = useState('Login');
  const { token, loginUser, registerUser, sendResetCode, resetPassword } = useContext(ShopContext);
  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === 'Sign Up') {
        await registerUser(name, email, password);
      } else if (currentState === 'Login') {
        await loginUser(email, password);
      } else if (currentState === 'Forgot Password') {
        if (!isCodeSent) {
          await sendResetCode(email);
          setIsCodeSent(true);
          setIsVerifying(true);
          toast.success('Reset code sent to your email');
        } else {
          if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
          }
          const success = await resetPassword(email, resetCode, password);
          if (success) {
            setCurrentState('Login');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setResetCode('');
            setIsCodeSent(false);
            setIsVerifying(false);
          }
        }
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

  const getTitle = () => {
    switch (currentState) {
      case 'Login':
        return 'Welcome Back!';
      case 'Sign Up':
        return 'Create Account';
      case 'Forgot Password':
        return isCodeSent ? 'Reset Password' : 'Forgot Password';
      default:
        return 'Welcome';
    }
  }

  return (
    <div className='min-h-screen w-full bg-white flex items-center justify-center py-16'>
      <div className='w-full max-w-md flex flex-col items-center bg-white rounded-2xl shadow-lg p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-5xl mb-4 text-black font-[Editorial]'>
            Page Turner
          </h1>
          <h2 className='text-2xl font-[SourceSans] text-neutral-600'>
            {getTitle()}
          </h2>
        </div>

        <div className='w-full'>
          <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
            {currentState === 'Sign Up' && (
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
                required
              />
            </div>

            {currentState === 'Forgot Password' && isCodeSent && (
              <div className='space-y-2'>
                <label className='text-sm font-medium text-neutral-600'>Reset Code</label>
                <input 
                  onChange={(e) => setResetCode(e.target.value)} 
                  value={resetCode}
                  type="text"
                  placeholder='Enter reset code'
                  className='w-full p-3 rounded-lg border-2 border-neutral-200 focus:border-black transition-colors outline-none text-lg'
                  required
                  maxLength={6}
                />
              </div>
            )}

            {(currentState !== 'Forgot Password' || isVerifying) && (
              <div className='space-y-2'>
                <label className='text-sm font-medium text-neutral-600'>
                  {currentState === 'Forgot Password' ? 'New Password' : 'Password'}
                </label>
                <input 
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password} 
                  type="password" 
                  placeholder={currentState === 'Forgot Password' ? 'Enter new password' : 'Enter your password'}
                  className='w-full p-3 rounded-lg border-2 border-neutral-200 focus:border-black transition-colors outline-none text-lg'
                  required
                />
              </div>
            )}

            {currentState === 'Forgot Password' && isVerifying && (
              <div className='space-y-2'>
                <label className='text-sm font-medium text-neutral-600'>Confirm New Password</label>
                <input 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  value={confirmPassword} 
                  type="password" 
                  placeholder='Confirm new password'
                  className='w-full p-3 rounded-lg border-2 border-neutral-200 focus:border-black transition-colors outline-none text-lg'
                  required
                />
              </div>
            )}

            <button 
              className='bg-black text-white p-4 rounded-lg font-medium text-lg w-full mt-4 hover:bg-neutral-800 transition-colors'
            > 
              {currentState === 'Login' ? 'LOGIN' : 
               currentState === 'Sign Up' ? 'SIGN UP' :
               isCodeSent ? 'RESET PASSWORD' : 'SEND RESET CODE'} 
            </button>

            {currentState === "Login" && (
              <button 
                type="button"
                onClick={() => {
                  setCurrentState('Forgot Password');
                  setPassword('');
                }}
                className='text-center text-sm text-neutral-600 hover:text-black transition-colors cursor-pointer w-full mt-4'
              >
                Forgot Password?
              </button>
            )}
          </form>

          {/* Removed the divider and Google sign-in button */}

          <p className='text-center mt-6 text-sm'>
            {currentState === 'Login' ? (
              <span className='text-neutral-600'>
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => {
                    setCurrentState('Sign Up');
                    setPassword('');
                  }} 
                  className='text-black font-medium hover:underline'
                >
                  Sign up
                </button>
              </span>
            ) : currentState === 'Sign Up' ? (
              <span className='text-neutral-600'>
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => {
                    setCurrentState('Login');
                    setPassword('');
                  }} 
                  className='text-black font-medium hover:underline'
                >
                  Login
                </button>
              </span>
            ) : (
              <span className='text-neutral-600'>
                Remember your password?{' '}
                <button 
                  type="button"
                  onClick={() => {
                    setCurrentState('Login');
                    setPassword('');
                    setIsCodeSent(false);
                    setIsVerifying(false);
                  }} 
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
