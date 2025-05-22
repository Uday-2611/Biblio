import { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import LatestCollection from '../components/LatestCollection';

const Home = () => {
  const [initialLoad, setInitialLoad] = useState(false);

  // Loading Animation -> 
  useEffect(() => {
    setTimeout(() => {
      setInitialLoad(true);
    }, 100);
  }, []);

  return (
    <div className='w-full mt-10 flex flex-col gap-10'>
      <div className='flex justify-between '>
        <div className='w-[100%] h-[90vh] overflow-hidden flex justify-between items-center p-8'>
          <div className='w-[50%] h-full relative' >
            <h1 className='text-white text-6xl absolute bottom-0 uppercase font-[Monsterat] text-[4.5vw] font-medium'>Where intellect meets obsession</h1>
          </div>
          <div className='h-full w-[50%] relative'>
            <img src={assets.scroller1} className={`w-[23vw] absolute bottom-0 right-0 z-10 transition-all duration-1000 ease-out ${!initialLoad ? 'translate-y-[-100vh]' : 'translate-y-0'}`} />
            <img src={assets.image1} className={`w-[23vw] absolute top-10 left-10 z-10 transition-all duration-1000 ease-out delay-300 ${!initialLoad ? 'translate-y-[-100vh]' : 'translate-y-0'}`} />
            <img src={assets.image3} className={`w-[13vw] absolute top-90 left-60 z-20 transition-all duration-1000 ease-out delay-600 ${!initialLoad ? 'translate-y-[-100vh]' : 'translate-y-0'}`} />
          </div>
        </div>
      </div>

      <div className='py-10  mb-2 rounded-xl w-[100%]'>
        <div className='container mx-auto px-8 uppercase'>
          <div className='flex justify-between items-center mb-12'>
            <h1 className='font-[Monsterat] font-medium text-4xl tracking-tight text-white'>Latest Collection</h1>
            <Link to="/collection">
              <Button variant="secondary" className="bg-white text-black px-8 font-medium text-md">
                SHOP ALL
              </Button>
            </Link>
          </div>
          <LatestCollection />
        </div>
      </div>
    </div>
  )
}

export default Home
