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
      <div className='relative min-h-[50vh] md:min-h-[90vh] flex items-center justify-center md:justify-between px-4 md:px-8'>
        <div className='text-center md:text-left md:w-1/2'>
          <h1 className='text-white text-4xl sm:text-5xl md:text-[4.5vw] uppercase font-[Monsterat] font-medium'>Where intellect meets obsession</h1>
        </div>
        
        <div className='hidden md:block w-1/2 relative h-full'>
          <img src={assets.scroller1} className={`w-[23vw] absolute bottom-0 right-0 z-10 transition-all duration-1000 ease-out ${!initialLoad ? 'translate-y-[-100vh]' : 'translate-y-0'}`} />
          <img src={assets.image1} className={`w-[23vw] absolute top-10 left-10 z-10 transition-all duration-1000 ease-out delay-300 ${!initialLoad ? 'translate-y-[-100vh]' : 'translate-y-0'}`} />
          <img src={assets.image3} className={`w-[13vw] absolute top-90 left-60 z-20 transition-all duration-1000 ease-out delay-600 ${!initialLoad ? 'translate-y-[-100vh]' : 'translate-y-0'}`} />
        </div>
      </div>

      <div className='py-8 md:py-10 mb-2 rounded-xl w-full'>
        <div className='container mx-auto px-4 md:px-8 uppercase mb-12 md:mb-20'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 md:mb-12'>
            <h1 className='font-[Monsterat] font-medium text-2xl md:text-4xl tracking-tight text-white text-center sm:text-left'>Latest Collection</h1>
            <Link to="/collection">
              <Button variant="secondary" className="bg-white text-black px-6 md:px-8 font-medium text-sm md:text-md w-full sm:w-auto">
                SHOP ALL
              </Button>
            </Link>
          </div>
          <LatestCollection />
        </div>
      </div>

      <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] flex flex-col justify-center gap-8 bg-[#151515] px-4 mb-20 py-8'>
        <h1 className='text-white font-[Monsterat] text-2xl sm:text-3xl md:text-[3vw] text-center'>
          Discover a World of Books at <br className='hidden sm:block'></br> Your Fingertips
        </h1>

        <div className='flex flex-col md:flex-row justify-evenly font-[SourceSans] gap-8 md:gap-4'>
          <div className='min-h-[300px] md:h-[60vh] w-full md:w-[25vw] rounded-md text-white flex flex-col items-center justify-evenly p-4'>
            <i className="ri-global-line text-3xl md:text-[2vw]"></i>
            <h1 className='text-center text-xl sm:text-2xl md:text-[2vw] leading-tight font-semibold'>Join Our Community of Book Lovers Today</h1>
            <p className='text-center font-light'>Biblio offers a vast selection of second-hand books for every reader</p>
            <Link to="/collection">
              <Button variant="secondary" size='small' className="bg-white text-black w-full sm:w-auto">
                BROWSE
              </Button>
            </Link>
          </div>

          <div className='min-h-[300px] md:h-[60vh] w-full md:w-[25vw] rounded-md text-white flex flex-col items-center justify-evenly p-4'>
            <i className="ri-store-line text-3xl md:text-[2vw]"></i>
            <h1 className='text-center text-xl sm:text-2xl md:text-[2vw] leading-tight font-semibold'>Easily Buy and Sell Your Favorite Books</h1>
            <p className='text-center font-light'>Our platform makes it simple to list and purchase books effortlessly</p>
            <Link to="/sell">
              <Button variant="secondary" size='small' className="bg-white text-black w-full sm:w-auto">
                SELL
              </Button>
            </Link>
          </div>

          <div className='min-h-[300px] md:h-[60vh] w-full md:w-[25vw] rounded-md text-white flex flex-col items-center justify-evenly p-4'>
            <i className="ri-group-line text-3xl md:text-[2vw]"></i>
            <h1 className='text-center text-xl sm:text-2xl md:text-[2vw] leading-tight font-semibold'>Connect with Fellow Readers and Share Your Passion</h1>
            <p className='text-center font-light'>Join a vibrant community where books enthusiasts gather to share insights</p>
            <Link to="/profile">
              <Button variant="secondary" size='small' className="bg-white text-black w-full sm:w-auto">
                JOIN
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] p-4 mb-20 flex flex-col md:flex-row'>
        <div className='w-full md:w-1/2 flex flex-col text-white gap-8 p-6 justify-center items-center'>
          <h1 className='font-[Monsterat] text-2xl sm:text-3xl md:text-[2.7vw] leading-tight text-center md:text-left'>
            Discover the Benefits of Shopping Second-Hand with Biblio
          </h1>
          <p className='font-light text-base sm:text-lg text-center md:text-left'>
            At Biblio, we believe in making books accessible to everyone. Enjoy affordable prices while contributing to a sustainable future.
          </p>
          <ul className='font-light text-base sm:text-lg flex flex-col gap-3'>
            <li>Save money while enjoying great literature.</li>
            <li>Support local sellers and promote community engagement.</li>
            <li>Reduce waste by choosing second-hand books</li>
          </ul>
        </div>
        <div className='w-full md:w-1/2 flex justify-center items-center overflow-hidden relative min-h-[300px] md:min-h-[400px] mt-8 md:mt-0'>
          <div className='relative w-full h-full flex items-center justify-center'>
            {images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                className={`w-[80%] sm:w-[50%] md:w-[25vw] max-h-[400px] object-contain absolute transition-all duration-1000 ${
                  index === currentImageIndex
                    ? 'translate-x-0 opacity-100'
                    : index === (currentImageIndex - 1 + images.length) % images.length
                    ? '-translate-x-full opacity-0'
                    : 'translate-x-full opacity-0'
                }`}
                style={{ 
                  left: '50%', 
                  transform: `translateX(-50%) ${
                    index === currentImageIndex 
                      ? 'translateX(0)' 
                      : index === (currentImageIndex - 1 + images.length) % images.length 
                      ? 'translateX(-100%)' 
                      : 'translateX(100%)'
                  }` 
                }} 
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home
