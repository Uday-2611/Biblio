import React from 'react'
import { assets } from '../assets/assets'
import Button from '../components/common/Button';
import LatestCollection from '../components/LatestCollection';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='w-full mt-20'>
      <div className='flex justify-between h-screen bg-[#d7cdb8]'>
        <div className='w-[40%] mt-8 ml-5 flex flex-col items-center gap-8'>
          <h1 className='text-[3vw] text-[#070606] font-light leading-20 w-full font-[EditorialLight]'>
            Rediscover books Relive <span className='font-[Editorial] text-[6vw] ml-20 tracking-tight'>Knowledge</span>
          </h1>
          <p className='w-[80%] font-[SourceSans] font-medium text-xl leading-6'>
            Explore books effortlessly with Page Turner's easy browsing, category filters, and wishlist feature to save your favorites for later.
          </p>
          <p className='w-[80%] font-[SourceSans] font-medium text-xl leading-6'>
            Check seller reviews and book condition details to make informed choices and find the best deals with confidence.
          </p>
        </div>

        <div className='w-[57%] h-[85vh] overflow-hidden rounded-[100px]'>
          <img src={assets.scroller1} className='h-full w-full object-cover' alt="" />
        </div>
      </div>

      <div className='py-16 bg-white w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw]'>
        <div className='container mx-auto px-8'>
          <div className='flex justify-between items-center mb-12'>
            <h1 className='font-[EditorialLight] text-6xl'>Books</h1>
            <Link to="/collection">
              <Button variant="secondary" className="bg-black text-white px-8 font-medium text-md">
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
