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
      <div className='relative min-h-[50vh] md:min-h-[90vh] flex flex-col items-center justify-end'>
        <div className='text-center w-full mb-12 '>
          <h1 className='text-gray-900 text-4xl sm:text-5xl md:text-[4vw] uppercase font-[Monsterat] font-medium text-left'>Books worth <span className='text-red-600 italic font-[Stardom] normal-case text-5xl sm:text-6xl md:text-[5vw] pr-6 '>reading <br /> prices</span>
            Worth Loving</h1>
        </div>

        {/* Expandable Boxes Section */}
        <div className='hidden md:flex w-full gap-2 h-[300px] '>
          {[
            { img: assets.imgHome1, title: 'Vast Collection', desc: 'Explore thousands of books across every genre imaginable' },
            { img: assets.imgHome2, title: 'Affordable Prices', desc: 'Quality second-hand books at unbeatable prices' },
            { img: assets.imgHome3, title: 'Easy Selling', desc: 'Turn your old books into cash with simple listing' },
            { img: assets.imgHome4, title: 'Fast Delivery', desc: 'Quick and reliable shipping right to your doorstep' },
            { img: assets.imgHome5, title: 'Secure Payment', desc: 'Safe and encrypted transactions for peace of mind' },
            { img: assets.imgHome6, title: 'Community', desc: 'Join thousands of book lovers sharing their passion' },
            { img: assets.imgHome7, title: 'Eco-Friendly', desc: 'Give books a second life and help the environment' }
          ].map((box, index) => (
            <div
              key={index}
              className='rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-500 ease-in-out flex-1 hover:flex-[2] group relative min-w-0'
            >
              {/* Background Image */}
              <div
                className='absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:blur-sm group-hover:scale-110'
                style={{ backgroundImage: `url(${box.img})` }}
              ></div>

              {/* Light Overlay */}
              <div className='absolute inset-0  group-hover:bg-white/50 transition-all duration-500'></div>

              {/* Text Content - Hidden by default, visible on hover */}
              <div className='relative z-10 text-gray-900 text-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0'>
                <h3 className='font-[Monsterat] text-xl md:text-2xl font-bold mb-2'>{box.title}</h3>
                <p className='text-sm md:text-base font-light leading-relaxed'>{box.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile fallback - show images */}
        <div className='md:hidden w-full relative h-[400px]'>
          <img src={assets.scroller1} className={`w-[50vw] absolute bottom-0 right-0 z-10 transition-all duration-1000 ease-out ${!initialLoad ? 'translate-y-[-90vh]' : 'translate-y-20'}`} />
          <img src={assets.image1} className={`w-[50vw] absolute top-0 left-5 z-10 transition-all duration-1000 ease-out delay-300 ${!initialLoad ? 'translate-y-[-100vh]' : 'translate-y-0'}`} />
          <img src={assets.image3} className={`w-[40vw] absolute top-10 right-10 z-20 transition-all duration-1000 ease-out delay-600 ${!initialLoad ? 'translate-y-[-100vh]' : 'translate-y-0'}`} />
        </div>
      </div>

      {/* Latest Collection */}
      <div className='py-8 md:py-10 mb-2 rounded-xl w-full mt-20 '>
        <div className='container mx-auto px-4 md:px-8 uppercase mb-12 md:mb-20'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 md:mb-12'>
            <h1 className='font-[Monsterat] font-medium text-2xl md:text-4xl tracking-tight text-gray-900 text-center sm:text-left'>Latest <span className='text-red-600 italic font-[Stardom] normal-case text-2xl sm:text-4xl md:text-6xl pr-6'>Collection</span> </h1>
            <Link to="/collection">
              <Button variant="secondary" className="bg-gray-900 text-white px-6 md:px-8 font-medium text-sm md:text-md w-full sm:w-auto">
                SHOP ALL
              </Button>
            </Link>
          </div>
          <LatestCollection />
        </div>
      </div>

      <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] flex flex-col justify-center gap-8 px-4 mb-20 py-8 '>
        <h1 className='text-gray-900 font-[Monsterat] text-2xl sm:text-3xl md:text-[3vw]'>
          Discover a World of <span className='text-red-600 italic font-[Stardom] normal-case text-2xl sm:text-4xl md:text-6xl pr-6'>Books</span> at your Fingertips
        </h1>

        <div className='flex flex-col md:flex-row justify-center font-[SourceSans] gap-2'>
          <div className='min-h-[400px] w-full md:w-[50vw] rounded-lg flex flex-col justify-center gap-4 p-8 bg-red-600'>
            <h1 className='text-left text-3xl md:text-4xl leading-tight font-bold text-white uppercase'>BROWSE THOUSANDS OF BOOKS</h1>
            <p className='text-left font-normal text-white text-base md:text-lg'>Biblio offers a vast selection of second-hand books for every reader across every genre imaginable.</p>
          </div>

          <div className='min-h-[400px] w-full md:w-[25vw] rounded-lg flex flex-col justify-center gap-4 p-8 bg-black'>
            <h1 className='text-left text-3xl md:text-4xl leading-tight font-bold text-white uppercase'>BUY & SELL WITH EASE</h1>
            <p className='text-left font-normal text-white text-base md:text-lg'>Our platform makes it simple to list and purchase books effortlessly with just a few clicks.</p>
          </div>

          <div className='min-h-[400px] w-full md:w-[25vw] rounded-lg flex flex-col justify-center gap-4 p-8 bg-black'>
            <h1 className='text-left text-3xl md:text-4xl leading-tight font-bold text-white uppercase'>JOIN OUR COMMUNITY</h1>
            <p className='text-left font-normal text-white text-base md:text-lg'>Connect with fellow readers and book enthusiasts who share your passion for literature.</p>
          </div>
        </div>
      </div>

      <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] p-4 mb-20 flex flex-col md:flex-row'>
        <div className='w-full md:w-1/2 flex flex-col text-gray-900 gap-8 p-6 justify-center items-center'>
          <h1 className='font-[Monsterat] text-3xl sm:text-3xl md:text-[3.5vw] text-center md:text-left leading-relaxed'>
            Discover the Benefits of Shopping Second-Hand with <span className='text-red-600 italic font-[Stardom] normal-case text-2xl sm:text-4xl md:text-6xl pr-6'>Biblio</span>
          </h1>
        </div>
        <div className='w-full md:w-1/2 flex justify-center items-center overflow-hidden relative min-h-[300px] md:min-h-[400px] mt-8 md:mt-0'>
          <div className='relative w-full h-full flex items-center justify-center'>
            {images.map((image, index) => (
              <img key={index} src={image} className={`w-[80%] sm:w-[50%] md:w-[25vw] max-h-[400px] object-contain absolute transition-all duration-1000 ${index === currentImageIndex
                ? 'translate-x-0 opacity-100'
                : index === (currentImageIndex - 1 + images.length) % images.length
                  ? '-translate-x-full opacity-0'
                  : 'translate-x-full opacity-0'
                }`} style={{
                  left: '50%',
                  transform: `translateX(-50%) ${index === currentImageIndex
                    ? 'translateX(0)'
                    : index === (currentImageIndex - 1 + images.length) % images.length
                      ? 'translateX(-100%)'
                      : 'translateX(100%)'
                    }`
                }} />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home
