import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const FrontPage = () => {
    const [animationStage, setAnimationStage] = useState(0);
    const [currentWord, setCurrentWord] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const words = ['students', 'professionals', 'readers'];

    useEffect(() => {
        const timers = [
            setTimeout(() => setAnimationStage(1), 1000),
            setTimeout(() => setAnimationStage(2), 2000),
            setTimeout(() => setAnimationStage(3), 3000),
            setTimeout(() => setAnimationStage(4), 4000),
        ];

        const wordInterval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 3000);

        const handleMouseMove = (e) => {
            requestAnimationFrame(() => {
                setMousePosition({ x: e.clientX, y: e.clientY });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            timers.forEach(timer => clearTimeout(timer));
            clearInterval(wordInterval);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className='w-full h-screen flex justify-center items-center flex-col relative overflow-hidden'>

            {/* Cursor follower -> */}
            <div className='fixed w-3 h-3 bg-neutral-500 rounded-full pointer-events-none mix-blend-difference z-50 transition-all duration-500 ease-out'
                style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y}px`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px rgba(115,115,115,0.3)'
                }} />

            <div className='relative z-10 flex flex-col items-center'>
                <h1 className={`text-neutral-200 font-[Editorial] font-bold text-[12rem] transition-opacity duration-1000 ${animationStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    Biblio
                </h1>

                <div className={` font-[Monsterat] flex items-center gap-2 text-xl text-neutral-400 mt-4 transition-all duration-1000 ${animationStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} >
                    <span>A marketplace for</span>
                    <div className='relative'>
                        <div className='relative px-4 py-2 rounded-lg transition-all duration-1000 ease-in-out border border-red-500' style={{
                            width: currentWord === 0 ? '140px' :
                                currentWord === 1 ? '180px' : '120px',
                            boxShadow: '0 0 20px rgba(239,68,68,0.3)'
                        }} >
                            <div className='relative h-8 overflow-hidden'>
                                {words.map((word, i) => (
                                    <div key={word} className={`absolute w-full text-center transition-all duration-1000 ease-in-out ${currentWord === i
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-full'
                                        }`} >
                                        {word}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`absolute bottom-12 w-full flex justify-center left-0 transition-all duration-1000 ${animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} >
                <div className="relative inline-flex items-center justify-center gap-4 group">
                    <div className="absolute rounded-xl"></div>
                    <NavLink to='/login' className="group relative inline-flex items-center justify-center text-base rounded-sm bg-red-700 px-8 py-3 font-[Monsterat] text-white transition-all duration-200 hover:shadow-lg hover:scale-105 " >
                        SHOP NOW
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default FrontPage