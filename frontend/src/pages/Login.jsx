import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';

const clerkAppearance = {
  elements: {
    rootBox: 'w-full',
    card: 'shadow-none border-0 p-0 bg-transparent w-full',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
  }
};

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  const setMode = (newMode) => {
    setSearchParams({ mode: newMode });
  };
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/home';
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate, from]);

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-[#f9f6f1] relative overflow-hidden p-4'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,_rgba(249,157,85,0.22)_0%,_rgba(211,194,255,0.1)_48%,_rgba(249,246,241,0.92)_78%)]'></div>

      <div className='relative z-10 w-full max-w-md rounded-[28px] border border-white/80 bg-white/70 p-6 sm:p-8 shadow-[0_16px_36px_rgba(25,25,35,0.12)] backdrop-blur-md'>
        <div className='mb-6 text-center'>
          <h1 className='text-5xl text-red-600 font-[Gambarino] tracking-tight'>Biblio</h1>
          <p className='font-[SourceSans] text-xs uppercase tracking-[0.16em] text-neutral-600 mt-2'>
            {mode === 'signin' ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        <div className='mb-4 flex rounded-lg border border-neutral-200 p-1 bg-white'>
          <button
            type='button'
            onClick={() => setMode('signin')}
            aria-pressed={mode === 'signin'}
            className={`w-1/2 rounded-md px-3 py-2 text-sm font-semibold tracking-[0.08em] ${mode === 'signin' ? 'bg-red-600 text-white' : 'text-neutral-700'}`}
          >
            SIGN IN
          </button>
          <button
            type='button'
            onClick={() => setMode('signup')}
            aria-pressed={mode === 'signup'}
            className={`w-1/2 rounded-md px-3 py-2 text-sm font-semibold tracking-[0.08em] ${mode === 'signup' ? 'bg-red-600 text-white' : 'text-neutral-700'}`}
          >
            SIGN UP
          </button>
        </div>

        <div className='flex justify-center'>
          {mode === 'signin' ? (
            <SignIn appearance={clerkAppearance} />
          ) : (
            <SignUp appearance={clerkAppearance} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
