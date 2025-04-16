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
    <div className='h-screen w-full bg-white flex '>
      <div className='w-full flex flex-col items-center'>
        <div className=''>
          <h1 className='text-[6vw] mt-5 text-black font-[Novarese] ' >
            Page Turner
          </h1>
          <h1>{currentState}</h1>
        </div>

        <div className=' w-full m-auto flex flex-col font-[Monsterat]'>
          <form onSubmit={onSubmitHandler} className='flex flex-col gap-3'>
            {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} required type="text" placeholder='NAME' className='bg-white p-3 rounded-lg w-[25%] m-auto text-center text-lg font-semibold placeholder-neutral-400 placeholder:font-[Monsterat] placeholder:text-md placeholder:font-medium border-2' />}

            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='EMAIL' className='bg-white p-3 rounded-lg w-[25%] m-auto text-center text-lg font-semibold placeholder-neutral-400 placeholder:font-[Monsterat] placeholder:text-md placeholder:font-medium border-2' />

            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='PASSWORD' className='bg-white p-3 rounded-lg w-[25%] m-auto text-center text-lg font-semibold placeholder-neutral-400 placeholder:font-[Monsterat] placeholder:text-md placeholder:font-medium border-2' />

            <button className='bg-black text-white p-3 rounded-lg w-[25%] m-auto font-medium text-lg'> {currentState === 'Login' ? 'LOGIN' : 'SIGN UP'} </button>

            {currentState === "Login" ? <p className='cursor-pointer m-auto'>Forgot Password ?</p> : ''}

          </form>

          <h1 className='text-black m-auto mt-4 font-medium '>OR</h1>

          <button className='bg-black text-white p-3 rounded-lg w-[25%] text-lg font-medium m-auto mt-4 flex gap-3 justify-center'><i class="ri-google-fill"></i>CONTINUE WITH GOOGLE</button>

          {
            currentState === 'Login'
              ? <h4 onClick={() => setCurrentState('Sign Up')} className=' cursor-pointer m-auto mt-2 text-neutral-400 text-sm '>CREATE NEW ACCOUNT</h4>
              : <h4 onClick={() => setCurrentState('Login')} className=' cursor-pointer m-auto mt-2 text-neutral-400 text-sm '>LOGIN</h4>
          }

        </div>
      </div>
    </div>
  )
}

export default Login
