const Footer = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

    return (
        <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] bg-[#111] relative overflow-hidden'>
            <div className='w-full h-[60%] bg-[#191919] flex relative'>
                <div className='w-[100vw] h-[50vw] rounded-full absolute top-0 left-0 bg-gradient-to-r from-neutral-900 via-red-800 to-neutral-900 blur-[80%] animate-gooey' style={{ animationDuration: '30s' }}></div>

                <div className='w-[100vw] h-[55vw] rounded-full absolute top-0 left-0 bg-gradient-to-r from-red-700 via-red-800 to-red-700 blur-[80%] animate-gooey' style={{ animationDuration: '30s', animationDelay: '-8s' }}></div>

                <div className='w-[100vw] h-[50vw] rounded-full absolute top-0 left-0 bg-gradient-to-r from-red-700 via-neutral-900 to-red-600 blur-[80%] animate-gooey' style={{ animationDuration: '30s', animationDelay: '-16s' }}></div>

                <div className='w-[100vw] h-[65vw] rounded-full absolute top-0 left-0 bg-gradient-to-r from-red-900 via-red-600 to-red-800 blur-[80%] animate-gooey' style={{ animationDuration: '30s', animationDelay: '-24s' }}></div>

                <div className='w-[65%] p-16 relative z-10'>
                    <h1 className='font-[Editorial] text-white text-8xl tracking-wide'>
                        Biblio
                    </h1>
                </div>
                <div className='w-[35%] flex flex-col relative z-10'>
                    <div className='w-full h-1/2 flex flex-col p-16 gap-6'>
                        <h1 className='font-[SourceSans] text-white text-xl'>Sign up for the latest updates.</h1>
                        <form onSubmit={onSubmitHandler} action="" className="flex flex-col">
                            <input type="email" required placeholder='ENTER EMAIL' className='placeholder:font-[Monsterat] bg-white w-full py-4 px-8' />
                            <button type='submit' className="bg-black text-white font-medium text-md mt-2 w-full py-4 px-8 font-[Monsterat] hover:text-neutral-300 relative z-10 cursor-pointer" >
                                SIGN UP
                            </button>
                        </form>
                    </div>
                    <div className='w-full h-1/2 text-white p-16 flex flex-col justify-end font-[Monsterat] tracking-wide'>
                        <h1 className='text-md'>MEET THE DEVELOPER</h1>
                        <ul className='m-2 text-sm flex justify-evenly'>
                            <li className="cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:bg-clip-text hover:text-transparent">
                                <a href="https://www.instagram.com/udayy2604/" target='_blank'>INSTAGRAM</a>
                            </li>
                            <li className="cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:bg-clip-text hover:text-transparent">
                                <a href="https://www.linkedin.com/in/udayagarwal2611/" target='_blank'>LINKEDIN</a>
                            </li>
                            <li className="cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-900 hover:bg-clip-text hover:text-transparent">
                                <a href="https://github.com/Uday-2611" target='_blank'>GITHUB</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
