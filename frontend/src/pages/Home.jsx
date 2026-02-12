import { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import LatestCollection from '../components/LatestCollection';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [assets.oldMan, assets.george, assets.penguin];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className='w-full pt-6 md:pt-8 flex flex-col gap-16'>
      <section className='relative min-h-[70vh] overflow-hidden rounded-[38px] px-4 pb-12 pt-20 sm:px-7 md:min-h-[90vh] md:px-14 md:pb-20 md:pt-28'>
        <div className='absolute inset-0 bg-[#f9f6f1]'></div>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,157,85,0.46)_0%,_rgba(211,194,255,0.38)_45%,_rgba(249,246,241,0.88)_72%)]'></div>
        <div className='absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#ffbb85]/55 blur-3xl'></div>
        <div className='absolute bottom-0 right-[-6rem] h-56 w-56 rounded-full bg-[#cbc6ff]/50 blur-3xl'></div>

        <div className='relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center text-center'>
          <p className='rounded-full border border-white/75 bg-white/70 px-5 py-2 text-xs font-semibold tracking-[0.13em] text-neutral-700 shadow-sm md:text-sm'>
            INDIA'S BOOK MARKETPLACE
          </p>

          <h1 className='mt-12 max-w-4xl font-["Gambarino"] text-5xl leading-[0.96] text-neutral-900 sm:text-6xl md:text-[80px]'>
            Buy and sell books with ease on Biblio
          </h1>

          <p className='mt-4 max-w-3xl font-["SourceSans"] text-base leading-relaxed text-neutral-700/85 sm:text-lg md:text-xl'>
            Discover affordable reads, list your old books in minutes, and connect with a growing community of readers across the country.
          </p>

          <div className='mt-32 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <Link to='/collection' className='group relative overflow-hidden rounded-lg bg-gradient-to-b from-neutral-900 to-neutral-800 px-9 py-4 text-sm font-semibold tracking-[0.14em] text-white transition-colors duration-300 ease-out hover:text-neutral-900'>
              <span className='pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f99d55] via-[#d3c2ff] to-[#f9f6f1] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100'></span>
              <span className='relative z-10'>EXPERIENCE BIBLIO</span>
            </Link>
            <Link to='/sell' className='group relative overflow-hidden rounded-lg bg-white/80 px-8 py-4 text-sm font-semibold tracking-[0.12em] text-neutral-700 transition-colors duration-300 ease-out  hover:text-neutral-900'>
              <span className='pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f9f6f1] via-[#d3c2ff] to-[#f99d55] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100'></span>
              <span className='relative z-10'>LIST YOUR BOOKS</span>
            </Link>
          </div>

        </div>
      </section>

      <section className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] flex flex-col justify-center gap-8 px-4 mb-20 py-8 mt-28'>
        <h1 className='text-gray-900 font-[Gambarino] text-2xl sm:text-3xl md:text-[3vw] text-center'>
          Find the Right Book for You, and Pass Yours On
        </h1>

        <div className='flex flex-col md:flex-row justify-center font-[SourceSans] gap-2 mt-16'>
          <div className='min-h-[400px] w-full md:w-[70vw] md:h-[70vh] rounded-[50px] flex justify-center gap-4 p-4 bg-neutral-100 items-center'>
            <div className='w-[50%] h-[100%] rounded-3xl bg-gradient-to-br from-[#f99d55] via-[#d3c2ff] to-[#f9f6f1]'>
              <img
                src={assets.userHomeIcon}
                alt='Open book illustration'
                className='h-full w-full object-contain p-6'
              />
            </div>
            <div className='w-[50%] h-[100%] flex flex-col justify-center p-12'>
              <h1 className='text-3xl md:text-5xl leading-tight text-neutral-900'>
                Built Around Readers Like You
              </h1>
              <p className='mt-5 font-["SourceSans"] text-base md:text-lg leading-relaxed text-neutral-600'>
                Browse affordable second-hand books, save your favorites, and sell the books you have finished in just a few steps. Biblio is designed to make reading more accessible while helping users earn, discover, and share more value from every book.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Collection */}
      <section className='py-8 md:py-10 mb-2 rounded-xl w-full mt-8 '>
        <div className='container mx-auto px-4 md:px-8 mb-12 md:mb-20'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 md:mb-12'>
            <h1 className='font-[Gambarino] text-2xl md:text-5xl tracking-tight text-gray-900 text-center sm:text-center mx-auto'>Discover a World of Books at your Fingertips</h1>
          </div>
          <LatestCollection />
        </div>
      </section>

      <section className='relative mb-20 overflow-hidden rounded-[38px] px-5 py-10 md:px-10 md:py-14'>
        <div className='absolute inset-0 bg-[#f9f6f1]'></div>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(249,157,85,0.28)_0%,_rgba(211,194,255,0.24)_48%,_rgba(249,246,241,0.92)_78%)]'></div>
        <div className='absolute -bottom-10 right-10 h-40 w-40 rounded-full bg-[#d3c2ff]/35 blur-3xl'></div>

        <div className='relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10'>
          <div className='flex flex-col gap-6 text-neutral-900'>
            <p className='w-fit rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-neutral-700'>
              WHY READERS CHOOSE BIBLIO
            </p>
            <h1 className='font-[Gambarino] text-4xl leading-[1.02] sm:text-5xl md:text-[3.4vw]'>
              Smarter Book Buying, Better Value, More Reuse
            </h1>
            <p className='max-w-xl font-["SourceSans"] text-base leading-relaxed text-neutral-700 md:text-lg'>
              Build your reading list affordably, discover titles faster, and keep books moving between readers instead of shelves.
            </p>
          </div>

          <div className='relative h-[320px] overflow-hidden rounded-[28px] border border-white/60 bg-white/60 shadow-[0_14px_34px_rgba(26,26,38,0.12)] backdrop-blur-md md:h-[420px]'>
            <div className='absolute -top-10 right-6 h-28 w-28 rounded-full bg-[#f99d55]/30 blur-3xl'></div>
            <div className='relative h-full w-full'>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                    index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Featured book ${index + 1}`}
                    className='w-[72%] max-h-[300px] object-contain md:w-[66%] md:max-h-[360px]'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] flex flex-col justify-center gap-8 px-4 mb-20 py-8 mt-28'>
        
        <div className='flex flex-col md:flex-row justify-center font-[SourceSans] gap-2 mt-16 '>
          <div className='min-h-[400px] w-full md:w-[70vw] md:h-[70vh] rounded-[50px] flex justify-center gap-4 p-4 bg-neutral-100 items-center'>
            <div className='h-full w-full rounded-3xl bg-gradient-to-br from-[#d9ecff] via-[#ffffff] to-[#dfe4ea] p-8 md:p-14 flex flex-col items-center justify-center text-center'>
              <h2 className='max-w-4xl font-[Gambarino] text-4xl leading-[1.02] text-black sm:text-5xl md:text-[3vw]'>
                Buy smarter. Sell easier. Keep books moving.
              </h2>
              <Link to='/collection' className='group relative mt-10 overflow-hidden rounded-lg bg-gradient-to-b from-neutral-900 to-neutral-800 px-9 py-4 text-sm font-semibold tracking-[0.14em] text-white transition-colors duration-300 ease-out hover:text-neutral-900'>
                <span className='pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f99d55] via-[#d3c2ff] to-[#f9f6f1] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100'></span>
                <span className='relative z-10'>EXPERIENCE BIBLIO</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
