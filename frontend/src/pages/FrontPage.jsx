import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import InfiniteDragScroll from '../components/common/InfiniteDragScroll'

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
            <div className="absolute inset-0 z-0 select-none">
                <InfiniteDragScroll />
            </div>

            <div className='relative z-10 flex flex-col items-center'>
                <h1 className={`text-neutral-200 font-[Stardom] font-bold text-[12rem] transition-opacity duration-1000 ${animationStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    Biblio
                </h1>
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