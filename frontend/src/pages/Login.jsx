import { useEffect, useState } from 'react'
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
      if (currentState === 'Login') {
        await loginUser(email, password);
      } else if (currentState === 'Sign Up') {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        await registerUser(name, email, password);
      } else if (currentState === 'Forgot Password') {
        if (!isCodeSent) {
          const success = await sendResetCode(email);
          if (success) {
            setIsCodeSent(true);
          }
        } else {
          if (!resetCode.trim()) {
            toast.error('Please enter the reset code');
            return;
          }
          if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
          }
          setIsVerifying(true);
          await resetPassword(email, resetCode, password);
          setIsVerifying(false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token, navigate, from])

  return (
    <div className='min-h-screen w-full flex flex-col md:flex-row bg-neutral-50'>

      {/* Blob Animation */}
      <div className='hidden md:flex w-full md:w-[40%] h-[40vh] md:h-screen relative justify-center items-center'>
        <div
          className='h-[30vw] w-[30vw] absolute rounded-full bg-gradient-to-tr from-white to-red-400 blur-[45px] animate-gooey'
          style={{ animationDuration: '18s', animationTimingFunction: 'ease-in-out' }}
        ></div>
        <div
          className='h-[25vw] w-[25vw] absolute rounded-full bg-gradient-to-tr from-red-400 to-red-700 blur-[50px] animate-gooey'
          style={{ animationDelay: '-3s', animationDuration: '20s', animationTimingFunction: 'ease-in-out' }}
        ></div>
        <div
          className='h-[20vw] w-[20vw] absolute rounded-full bg-gradient-to-tr from-red-300 to-red-600 blur-[55px] animate-gooey'
          style={{ animationDelay: '-6s', animationDuration: '22s', animationTimingFunction: 'ease-in-out' }}
        ></div>
        <div
          className='h-[15vw] w-[15vw] absolute rounded-full bg-gradient-to-tr from-red-500 to-red-700 blur-[60px] animate-gooey'
          style={{ animationDelay: '-9s', animationDuration: '24s', animationTimingFunction: 'ease-in-out' }}
        ></div>
      </div>

      <div className='w-full md:w-[60%] min-h-screen flex items-center justify-center p-6 md:p-12'>
        <div className='w-full max-w-md flex flex-col items-center'>
          <div className='text-center mb-6'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl mb-4 text-red-600 font-[Stardom] tracking-tighter'>
              Biblio
            </h1>
          </div>

          <div className='w-full'>
            <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
              {currentState === 'Sign Up' && (
                <div className='space-y-2'>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className='w-full p-3 bg-neutral-100 rounded-lg text-neutral-900 focus:outline-none' required placeholder='Enter your Full Name' />
                </div>
              )}

              <div className='space-y-2'>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className='w-full p-3 bg-neutral-100 rounded-lg text-neutral-900 focus:outline-none' required placeholder='Enter a valid email' />
              </div>

              {(currentState === 'Login' || currentState === 'Sign Up' || (currentState === 'Forgot Password' && isCodeSent)) && (
                <div className='space-y-2'>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className='w-full p-3 bg-neutral-100 rounded-lg text-neutral-900 focus:outline-none' required placeholder='Password' />
                </div>
              )}

              {(currentState === 'Sign Up' || (currentState === 'Forgot Password' && isCodeSent)) && (
                <div className='space-y-2'>
                  <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='w-full p-3 bg-neutral-100 rounded-lg text-neutral-900 focus:outline-none' required placeholder='Confirm Password' />
                </div>
              )}

              {currentState === 'Forgot Password' && isCodeSent && (
                <div className='space-y-2'>
                  <input type="text" id="resetCode" value={resetCode} onChange={(e) => setResetCode(e.target.value)} className='w-full p-3 bg-neutral-100 rounded-lg text-neutral-900 focus:outline-none' required placeholder='Reset Code' />
                </div>
              )}

              <button type="submit" className='w-full p-3 bg-red-600 text-white mt-4 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg' disabled={isVerifying} >
                {currentState === 'Login' ? 'LOGIN' :
                  currentState === 'Sign Up' ? 'SIGN UP' :
                    isCodeSent ? 'RESET PASSWORD' : 'SEND RESET CODE'}
              </button>

              {currentState === "Login" && (
                <button type="button" onClick={() => {
                  setCurrentState('Forgot Password');
                  setPassword('');
                }} className='text-center text-sm text-neutral-700 hover:text-neutral-900 hover:underline transition-colors cursor-pointer w-full mt-4' >
                  Forgot Password?
                </button>
              )}
            </form>

            <p className='text-center mt-6 text-sm text-neutral-700'>
              {currentState === 'Login' ? (
                <span>
                  Don&apos;t have an account?{' '}
                  <button type="button" onClick={() => {
                    setCurrentState('Sign Up');
                    setPassword('');
                  }} className='text-neutral-900 font-medium hover:underline' >
                    Sign up
                  </button>
                </span>
              ) : currentState === 'Sign Up' ? (
                <span>
                  Already have an account?{' '}
                  <button type="button" onClick={() => {
                    setCurrentState('Login');
                    setPassword('');
                  }} className='text-neutral-900 font-medium hover:underline' >
                    Login
                  </button>
                </span>
              ) : (
                <span>
                  Remember your password?{' '}
                  <button type="button" onClick={() => {
                    setCurrentState('Login');
                    setPassword('');
                    setIsCodeSent(false);
                    setIsVerifying(false);
                  }} className='text-neutral-900 font-medium hover:underline' >
                    Login
                  </button>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
