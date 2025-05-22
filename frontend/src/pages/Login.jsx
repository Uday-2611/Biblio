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
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
  }

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token, navigate, from])

  return (
    <div className='min-h-screen w-[100vw] flex'>

      <div className='w-[40%] h-screen border-r border-r-neutral-600 relative overflow-hidden flex justify-center items-center'>
        <div className='h-[30vw] w-[30vw] absolute rounded-full bg-gradient-to-tr from-neutral-900 to-red-800 blur-[40px] animate-gooey'></div>
        <div className='h-[25vw] w-[25vw] absolute rounded-full bg-gradient-to-tr from-red-700 to-red-800 blur-[45px] animate-gooey' style={{ animationDelay: '-3s' }}></div>
        <div className='h-[20vw] w-[20vw] absolute rounded-full bg-gradient-to-tr from-red-600 to-neutral-900 blur-[50px] animate-gooey' style={{ animationDelay: '-6s' }}></div>
        <div className='h-[15vw] w-[15vw] absolute rounded-full bg-gradient-to-tr from-red-500 to-red-600 blur-[55px] animate-gooey' style={{ animationDelay: '-9s' }}></div>
      </div>

      <div className='w-[60%] h-screen flex items-center justify-center'>
        <div className='w-full max-w-md flex flex-col items-center p-8 '>
          <div className='text-center mb-8 '>
            <h1 className='text-6xl mb-4 text-neutral-100 font-[Editorial] tracking-tighter'>
              Page Turner
            </h1>
          </div>

          <div className='w-full'>
            <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
              {currentState === 'Sign Up' && (
                <div className='space-y-2'>
                  <input onChange={(e) => setName(e.target.value)} value={name} required type="text" placeholder='Enter your name' className='w-full p-3 bg-[#232323] transition-colors outline-none placeholder:text-neutral-500 text-white font-[Monsterat]' />
                </div>
              )}

              <div className='space-y-2'>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Enter your email' className='w-full p-3 bg-[#232323] transition-colors outline-none placeholder:text-neutral-500 text-white font-[Monsterat]' required />
              </div>

              {currentState === 'Forgot Password' && isCodeSent && (
                <div className='space-y-2'>
                  <input onChange={(e) => setResetCode(e.target.value)} value={resetCode} type="text" placeholder='Enter reset code' className='w-full p-3 bg-[#232323] transition-colors outline-none placeholder:text-neutral-500 text-white font-[Monsterat]' required maxLength={6} />
                </div>
              )}

              {(currentState !== 'Forgot Password' || isVerifying) && (
                <div className='space-y-2'>
                  <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder={currentState === 'Forgot Password' ? 'Enter new password' : 'Enter your password'} className='w-full p-3 bg-[#232323] transition-colors outline-none placeholder:text-neutral-500 text-white font-[Monsterat]g' required />
                </div>
              )}

              {currentState === 'Forgot Password' && isVerifying && (
                <div className='space-y-2'>
                  <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" placeholder='Confirm new password' className='w-full p-3 bg-[#232323] transition-colors outline-none placeholder:text-neutral-500 text-white font-[Monsterat]' required />
                </div>
              )}

              <button className='bg-white text-black p-4 font-[Monsterat] font-medium w-full mt-4 hover:bg-neutral-200 transition-colors' >
                {currentState === 'Login' ? 'LOGIN' :
                  currentState === 'Sign Up' ? 'SIGN UP' :
                    isCodeSent ? 'RESET PASSWORD' : 'SEND RESET CODE'}
              </button>

              {currentState === "Login" && (
                <button type="button" onClick={() => {
                    setCurrentState('Forgot Password');
                    setPassword('');
                  }} className='text-center text-sm text-white hover:underline transition-colors cursor-pointer w-full mt-4' >
                  Forgot Password?
                </button>
              )}
            </form>

            <p className='text-center mt-6 text-sm'>
              {currentState === 'Login' ? (
                <span className='text-white'>
                  Don&apos;t have an account?{' '}
                  <button type="button" onClick={() => {
                      setCurrentState('Sign Up');
                      setPassword('');
                    }} className='text-white font-medium hover:underline' >
                    Sign up
                  </button>
                </span>
              ) : currentState === 'Sign Up' ? (
                <span className='text-white'>
                  Already have an account?{' '}
                  <button type="button" onClick={() => {
                      setCurrentState('Login');
                      setPassword('');
                    }} className='text-white font-medium hover:underline' >
                    Login
                  </button>
                </span>
              ) : (
                <span className='text-white'>
                  Remember your password?{' '}
                  <button type="button" onClick={() => {
                      setCurrentState('Login');
                      setPassword('');
                      setIsCodeSent(false);
                      setIsVerifying(false);
                    }} className='text-white font-medium hover:underline' >
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
