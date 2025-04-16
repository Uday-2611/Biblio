import React from 'react'
import Button from '../components/common/Button';


const Footer = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

    return (
        <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] h-[90vh] bg-black flex flex-col'>
            <div className='w-full h-[40%]'></div>
            <div className='w-full h-[60%] bg-[#191919] flex'>
                <div className='w-[65%] p-16'>
                    <h1 className='font-[Editorial] text-white text-5xl tracking-wide'>
                        Page <br />Turner
                    </h1>
                </div>
                <div className='w-[35%] flex flex-col'>
                    <div className='w-full h-1/2 flex flex-col p-16 gap-6'>
                        <h1 className='font-[SourceSans] text-white text-xl'>Sign up for the latest updates.</h1>
                        <form onSubmit={onSubmitHandler} action="">
                            <input type="email" required placeholder='ENTER EMAIL' className='placeholder:font-[Monsterat] bg-white w-full py-4 px-8 rounded-lg' />
                            <button type = 'submit' className="bg-black text-white font-medium text-md mt-2 w-full py-4 px-8 rounded-lg ">
                                SIGN UP 
                            </button>
                        </form>
                    </div>
                    <div className='w-full h-1/2 text-neutral-400 p-16 flex flex-col justify-end font-[Monsterat] tracking-wide'>
                        <h1 className='text-md'>MEET THE DEVELOPER</h1>
                        <ul className='m-2 text-sm flex justify-evenly'>
                            <li>INSTAGRAM</li>
                            <li>LINKEDIN</li>
                            <li>GITHUB</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
