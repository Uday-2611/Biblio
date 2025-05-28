import { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import LatestCollection from '../components/LatestCollection';

const Home = () => {
  const [initialLoad, setInitialLoad] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [assets.oldMan, assets.george, assets.penguin];

  useEffect(() => {
    setTimeout(() => {
      setInitialLoad(true);
    }, 100);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
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
        <div className='container mx-auto px-8 uppercase mb-20'>
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

      <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] flex flex-col justify-center gap-8 bg-[#151515] px-4 mb-20 py-8'>
        <h1 className='text-white font-[Monsterat] text-[3vw] text-center'>
          Discover a World of Books at <br></br> Your Fingertips
        </h1>

        <div className='flex justify-evenly font-[SourceSans] '>
          <div className='h-[60vh] w-[25vw] rounded-md text-white flex flex-col items-center justify-evenly'>
            <i class="ri-global-line text-[2vw]"></i>
            <h1 className='text-center text-[2vw] leading-tight font-semibold'>Join Our Community of Book Lovers Today</h1>
            <p className='text-center font-light'>Biblio offers a vast selection of second-hand books for every reader</p>
            <Link to="/collection">
              <Button variant="secondary" size='small' className="bg-white text-black">
                BROWSE
              </Button>
            </Link>
          </div>

          <div className='h-[60vh] w-[25vw] rounded-md text-white flex flex-col  items-center justify-evenly'>
            <i class="ri-store-line text-[2vw]"></i>
            <h1 className='text-center text-[2vw] leading-tight font-semibold '>Easily Buy and Sell Your Favorite Books</h1>
            <p className='text-center font-light'>Our platform makes it simple to list and purchase books effortlessly</p>
            <Link to="/sell">
              <Button variant="secondary" size='small' className="bg-white text-black">
                SELL
              </Button>
            </Link>
          </div>

          <div className='h-[60vh] w-[25vw] rounded-md text-white flex flex-col items-center justify-evenly'>
            <i class="ri-group-line text-[2vw]"></i>
            <h1 className='text-center text-[2vw] leading-tight font-semibold'>Connect with Fellow Readers and Share Your Passion</h1>
            <p className='text-center font-light'>Join a vibrant community where books enthusiats gather to share insights</p>
            <Link to="/profile">
              <Button variant="secondary" size='small' className="bg-white text-black">
                JOIN
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] p-4 mb-20 flex'>
        <div className='w-1/2 flex flex-col text-white gap-8 p-6 justify-center items-center'>
          <h1 className='font-[Monsterat] text-[2.7vw] leading-tight'>
            Discover the Benefits of Shopping Second-Hand with Biblio
          </h1>
          <p className='font-light text-lg'>
            At Biblio, we believe in making books accessible to everyone. Enjoy affordable prices while contributing to a sustainable future.
          </p>
          <ul className='font-light text-lg flex flex-col gap-3'>
            <li>Save money while enjoying great literature.</li>
            <li>Support local sellers and promote community engagement.</li>
            <li>Reduce waste by choosing second-hand books</li>
          </ul>
        </div>
        <div className='w-1/2 flex justify-center items-center overflow-hidden relative min-h-[400px]'>
          <div className='relative w-full h-full flex items-center justify-center'>
            {images.map((image, index) => (
              <img key={index} src={image} className={`w-[25vw] max-h-[400px] object-contain absolute transition-all duration-1000  ${
                  index === currentImageIndex
                    ? 'translate-x-0 opacity-100'
                    : index === (currentImageIndex - 1 + images.length) % images.length
                    ? '-translate-x-full opacity-0'
                    : 'translate-x-full opacity-0'
                }`}
                style={{ left: '50%', transform: `translateX(-50%) ${index === currentImageIndex ? 'translateX(0)' : index === (currentImageIndex - 1 + images.length) % images.length ? 'translateX(-100%)' : 'translateX(100%)'}`, }} />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home
