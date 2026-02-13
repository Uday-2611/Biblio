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

    const viewportCenterX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const viewportCenterY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    return (
        <div className='w-full h-screen flex justify-center items-center flex-col relative overflow-hidden bg-[#f9f6f1]'>
            <div className='absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_18%,_rgba(249,157,85,0.18)_0%,_rgba(211,194,255,0.08)_48%,_rgba(249,246,241,0.92)_78%)]'></div>
            <div className="absolute inset-0 z-10 select-none pointer-events-auto">
                <InfiniteDragScroll />
            </div>

            <div className='relative z-20 flex flex-col items-center'>
                <div
                    className='pointer-events-none absolute -inset-12 rounded-full bg-[radial-gradient(circle,_rgba(248,153,95,0.34)_0%,_rgba(248,153,95,0)_65%)] blur-2xl transition-transform duration-200'
                    style={{ transform: `translate(${(mousePosition.x - viewportCenterX) * 0.01}px, ${(mousePosition.y - viewportCenterY) * 0.01}px)` }}
                ></div>
                <h1 className={`relative font-[Gambarino] font-bold text-[12rem] leading-[0.9] tracking-[-0.03em] transition-opacity duration-1000 ${animationStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <span className='absolute inset-0 translate-x-1.5 translate-y-1.5 text-[#b23334]/40'>Biblio</span>
                    <span className='relative bg-[linear-gradient(180deg,#2c2b33_0%,#111018_65%,#6e1e1f_100%)] bg-clip-text text-transparent [text-shadow:0_8px_22px_rgba(23,23,33,0.18)]'>
                        Biblio
                    </span>
                </h1>
            </div>

            <div className={`absolute bottom-12 w-full flex justify-center left-0 z-20 transition-all duration-1000 ${animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} >
                <div className="relative inline-flex items-center justify-center gap-4 group">
                    <NavLink to='/login' className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-red-700 px-8 py-3 font-[SourceSans] text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-red-800" >
                        <span>Shop Now</span>
                        <i className="ri-arrow-right-up-line text-base"></i>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default FrontPage
