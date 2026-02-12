const Footer = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

    return (
        <footer className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] relative overflow-hidden px-4 py-8 md:px-8 md:py-10'>
            <div className='relative mx-auto min-h-[58vh] max-w-[1600px] overflow-hidden rounded-[38px] border border-white/70 bg-[#f9f6f1]'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(249,157,85,0.42)_0%,_rgba(211,194,255,0.36)_48%,_rgba(249,246,241,0.93)_76%)]'></div>
                <div className='absolute -top-16 -left-8 h-48 w-48 rounded-full bg-[#f8b482]/45 blur-3xl'></div>
                <div className='absolute -bottom-10 right-4 h-56 w-56 rounded-full bg-[#d3c2ff]/35 blur-3xl'></div>

                <div className='relative z-10 flex min-h-[58vh] flex-col md:flex-row'>
                    <div className='w-full md:w-[60%] p-8 md:p-14'>
                        <p className='w-fit rounded-full border border-white/70 bg-white/65 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-neutral-700'>
                            INDIA'S BOOK MARKETPLACE
                        </p>
                        <h1 className='mt-7 font-[Gambarino] text-6xl leading-none text-neutral-900 md:text-[120px]'>
                            Biblio
                        </h1>
                        <p className='mt-6 max-w-xl font-[SourceSans] text-base leading-relaxed text-neutral-700 md:text-lg'>
                            Buy affordably, sell easily, and keep great books moving between readers across the country.
                        </p>
                    </div>

                    <div className='w-full md:w-[40%] flex flex-col'>
                        <div className='w-full p-8 md:p-14 md:pb-10'>
                            <h2 className='font-[Gambarino] text-3xl text-neutral-900 md:text-4xl'>
                                Stay in the loop
                            </h2>
                            <form onSubmit={onSubmitHandler} className='mt-6 flex w-full max-w-md flex-col gap-3'>
                                <input type='email' required placeholder='Enter your email' className='w-full rounded-xl border border-white/80 bg-white/80 px-5 py-3 font-[SourceSans] text-neutral-800 outline-none backdrop-blur-sm placeholder:text-neutral-500 focus:border-neutral-300' />
                                <button type='submit' className='group relative overflow-hidden rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-800 px-6 py-3 text-sm font-semibold tracking-[0.12em] text-white transition-colors duration-300 ease-out hover:text-neutral-900'>
                                    <span className='pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f99d55] via-[#d3c2ff] to-[#f9f6f1] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100'></span>
                                    <span className='relative z-10'>SIGN UP</span>
                                </button>
                            </form>
                        </div>

                        <div className='mt-auto w-full px-8 pb-8 md:px-14 md:pb-14'>
                            <h3 className='text-sm font-semibold tracking-[0.16em] text-neutral-700'>
                                MEET THE DEVELOPER
                            </h3>
                            <ul className='mt-5 flex flex-row flex-wrap gap-5 text-sm font-semibold tracking-[0.08em] text-neutral-800'>
                                <li>
                                    <a href='https://www.instagram.com/udayy2604/' target='_blank' rel='noreferrer' className='transition-colors duration-300 hover:text-[#d85658]'>INSTAGRAM</a>
                                </li>
                                <li>
                                    <a href='https://www.linkedin.com/in/udayagarwal2611/' target='_blank' rel='noreferrer' className='transition-colors duration-300 hover:text-[#2b64b8]'>LINKEDIN</a>
                                </li>
                                <li>
                                    <a href='https://github.com/Uday-2611' target='_blank' rel='noreferrer' className='transition-colors duration-300 hover:text-[#3c3c3c]'>GITHUB</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
