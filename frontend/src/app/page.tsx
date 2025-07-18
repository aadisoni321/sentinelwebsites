"use client";

import React from 'react';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function HomePage() {
  const unifyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 = start, 1 = fully stacked

  // Custom scroll progress: 0 when section fully in view, 1 when bottom hits bottom
  useEffect(() => {
    function handleScroll() {
      if (!unifyRef.current) return;
      const rect = unifyRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Section fully in view: top >= 0 && bottom <= windowHeight
      if (rect.top >= 0 && rect.bottom <= windowHeight) {
        setProgress(0);
      } else if (rect.top < 0 && rect.bottom > windowHeight) {
        // Section is taller than viewport, user is scrolling through
        const total = rect.height - windowHeight;
        const scrolled = -rect.top;
        setProgress(Math.min(Math.max(scrolled / total, 0), 1));
      } else if (rect.top < 0 && rect.bottom <= windowHeight) {
        // Scrolled past the section
        setProgress(1);
      } else {
        setProgress(0);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate headline font size: large -> small, no opacity
  const headlineFontSize = useSpring(progress === 0 ? 12 : 4, { stiffness: 120, damping: 20 });

  // Card initial and final positions (X, Y)
  const cardInitial = [
    [-30, -10], // Smart (1)
    [30, -10],  // Smart (2)
    [-20, 10],  // Smart (3)
    [20, 10],   // Smart (4)
    [15, -20],  // Smart.png
  ];
  // All cards stack at (0,0) in the center
  const cardFinal = [ [0,0], [0,0], [0,0], [0,0], [0,0] ];

  // Interpolate X and Y for each card
  const getCardStyle = (i: number) => {
    const safeInit = (cardInitial && Array.isArray(cardInitial[i]) && typeof cardInitial[i][0] === 'number' && typeof cardInitial[i][1] === 'number') ? cardInitial[i] : [0, 0];
    const safeFin = (cardFinal && Array.isArray(cardFinal[i]) && typeof cardFinal[i][0] === 'number' && typeof cardFinal[i][1] === 'number') ? cardFinal[i] : [0, 0];
    const x = safeInit[0] + (safeFin[0] - safeInit[0]) * progress;
    const y = safeInit[1] + (safeFin[1] - safeInit[1]) * progress;
    return {
      x: `${x}vw`,
      y: `${y}vh`,
    };
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
      {/* NAVIGATION BAR */}
      <nav className="w-full flex items-center justify-between px-12 py-6 bg-black" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
        <div className="text-lg font-semibold tracking-wide">SENTINEL</div>
        <div className="flex-1 flex justify-center space-x-16">
          <a href="/product" className="text-base font-normal text-gray-300 hover:text-white transition">Product</a>
          <a href="/security" className="text-base font-normal text-gray-300 hover:text-white transition">Security</a>
          <a href="/pricing" className="text-base font-normal text-gray-300 hover:text-white transition">Pricing</a>
        </div>
        <Link href="/login">
          <button className="px-5 py-2 bg-white text-black font-semibold rounded border border-blue-500 hover:bg-blue-50 transition text-base" style={{ boxShadow: '0 0 0 2px #2563eb' }}>
            Get Started
          </button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center pt-20 pb-12 px-4 bg-black">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
          They Hope You Forget.<br />
          <span className="text-blue-500">We Make Sure You Don’t.</span>
        </h1>
        <p className="text-lg md:text-xl font-medium mb-8 mt-6 text-white" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
          The Subscription Manager That<br />Makes You Wallet Smile.
        </p>
        <button className="mx-auto text-base px-6 py-2 rounded border border-blue-500 text-black bg-white font-semibold shadow-sm hover:bg-blue-50 transition" style={{ boxShadow: '0 0 0 2px #2563eb' }}>
          Start Free Trial
        </button>
      </section>

      {/* OCEAN IMAGE SECTION */}
      <section className="flex justify-center items-center py-12 bg-black">
        <div className="w-[160vw] max-w-[2000px] aspect-[2/1] bg-black rounded-none overflow-hidden">
          <img src="/images/StudentStack - HAC (1).png" alt="Ocean" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* DASHBOARD / BLUE CARDS SECTION */}
      <section className="flex justify-center items-center py-12 bg-black">
        <div className="w-[117vw] max-w-[1560px] bg-black rounded-2xl p-0 flex flex-col items-center relative">
          <img 
            src="/images/StudentStack - HAC.png" 
            alt="Dashboard" 
            className="w-full h-auto rounded-2xl shadow-2xl relative z-20"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, white 16%, white 84%, transparent 100%), linear-gradient(to bottom, transparent 0%, white 16%, white 84%, transparent 100%)',
              WebkitMaskComposite: 'destination-in',
              WebkitMaskSize: 'cover, cover',
              maskImage: 'linear-gradient(to right, transparent 0%, white 16%, white 84%, transparent 100%), linear-gradient(to bottom, transparent 0%, white 16%, white 84%, transparent 100%)',
              maskComposite: 'intersect',
              maskSize: 'cover, cover'
            }}
          />
        </div>
      </section>

      {/* UNIFY YOUR FINANCES SECTION */}
      <section className="w-full bg-white text-black flex items-center justify-center px-8" style={{ minHeight: '100vh', height: '100vh', fontFamily: 'Gabriel Sans, sans-serif' }}>
        <div ref={unifyRef} className="relative w-full max-w-6xl flex flex-col items-center justify-center h-full">
          {/* Subtle fade at the edges of the white section */}
          <div className="pointer-events-none select-none absolute inset-0 z-0" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,1) 55%, rgba(255,255,255,0) 85%)'
          }} />
          {/* Cards scattered around headline, use actual images if available */}
          {/* Animated Cards */}
          <motion.div className="absolute left-0 top-0 w-full h-full pointer-events-none select-none">
            <motion.div style={{ ...getCardStyle(0), position: 'absolute', left: '50%', top: '20%' }} className="-translate-x-1/2 -translate-y-1/2">
              <img src="/icons/Smart (1).png" alt="Card 1" className="w-56 h-56 object-contain" />
            </motion.div>
            <motion.div style={{ ...getCardStyle(1), position: 'absolute', left: '50%', top: '50%' }} className="-translate-x-1/2 -translate-y-1/2">
              <img src="/icons/Smart (2).png" alt="Card 2" className="w-56 h-56 object-contain" />
            </motion.div>
            <motion.div style={{ ...getCardStyle(2), position: 'absolute', left: '50%', bottom: '12%' }} className="-translate-x-1/2 translate-y-1/2">
              <img src="/icons/Smart (3).png" alt="Card 3" className="w-56 h-56 object-contain" />
            </motion.div>
            <motion.div style={{ ...getCardStyle(3), position: 'absolute', right: '50%', bottom: '12%' }} className="translate-x-1/2 translate-y-1/2">
              <img src="/icons/Smart (4).png" alt="Card 4" className="w-56 h-56 object-contain" />
            </motion.div>
            <motion.div style={{ ...getCardStyle(4), position: 'absolute', right: '50%', top: '15%' }} className="translate-x-1/2 -translate-y-1/2">
              <img src="/icons/Smart.png" alt="Card 5" className="w-56 h-56 object-contain" />
            </motion.div>
          </motion.div>
          <motion.h2
            className="text-7xl md:text-9xl font-bold leading-tight text-center z-10"
            style={{ color: '#2563eb', fontSize: `${headlineFontSize.get()}rem` }}
          >
            UNIFY Your<br />Finances.
          </motion.h2>
        </div>
      </section>

      {/* GET STARTED FOR FREE SECTION */}
      <section className="text-center py-24 px-4 bg-black text-white">
        <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
          Get Started For <span className="text-blue-500">Free</span>
        </h2>
        <p className="text-lg md:text-xl font-medium mb-10" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
          Be the first to try Sentinel and enjoy the completely free option among powerful AI tools now.
        </p>
        <div className="flex justify-center gap-6">
          <button className="bg-white text-black text-base font-semibold px-8 py-3 rounded border border-blue-500 hover:bg-blue-50 transition" style={{ boxShadow: '0 0 0 2px #2563eb' }}>
            Get Started
          </button>
          <button className="text-white text-base font-semibold px-8 py-3 rounded border border-blue-500 hover:bg-blue-50 hover:text-black transition" style={{ boxShadow: '0 0 0 2px #2563eb' }}>
            Learn More
          </button>
        </div>
      </section>

      {/* ANIMATED LAYERED WAVE (ultra-complex, seamless, glowing, flowing) */}
      <div className="relative w-full overflow-hidden" style={{ height: '340px', marginBottom: '-2px', background: 'transparent' }}>
        <style>{`
          @keyframes waveMove1 {
            0% { transform: translateX(0) scaleY(1); }
            100% { transform: translateX(-60%) scaleY(1.08); }
          }
          @keyframes waveMove2 {
            0% { transform: translateX(0) scaleY(1); }
            100% { transform: translateX(-50%) scaleY(0.98); }
          }
          @keyframes waveMove3 {
            0% { transform: translateX(0) scaleY(1); }
            100% { transform: translateX(-70%) scaleY(1.04); }
          }
          @keyframes waveMove4 {
            0% { transform: translateX(0) scaleY(1); }
            100% { transform: translateX(-40%) scaleY(0.96); }
          }
          @keyframes waveMove5 {
            0% { transform: translateX(0) scaleY(1); }
            100% { transform: translateX(-80%) scaleY(1.12); }
          }
        `}</style>
        {/* Layer 1 - Deep Blue Glow */}
        <svg className="absolute bottom-0 w-full h-full" style={{ filter: 'blur(12px)', opacity: 0.85 }}>
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.9"/>
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="1"/>
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9"/>
            </linearGradient>
          </defs>
          <path 
            d="M0,220 Q200,120 400,220 T800,220 T1200,220 T1600,220 T2000,220 T2400,220 T2800,220 T3200,220 T3600,220 T4000,220 L4000,340 L0,340 Z" 
            fill="url(#waveGradient1)"
            style={{ animation: 'waveMove1 10s linear infinite' }}
          />
        </svg>
        {/* Layer 2 - Medium Blue */}
        <svg className="absolute bottom-0 w-full h-full" style={{ filter: 'blur(10px)', opacity: 0.7 }}>
          <defs>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8"/>
            </linearGradient>
          </defs>
          <path 
            d="M0,250 Q300,180 600,250 T1200,250 T1800,250 T2400,250 T3000,250 T3600,250 T4200,250 T4800,250 T5400,250 L5400,340 L0,340 Z" 
            fill="url(#waveGradient2)"
            style={{ animation: 'waveMove2 13s linear infinite' }}
          />
        </svg>
        {/* Layer 3 - Light Blue */}
        <svg className="absolute bottom-0 w-full h-full" style={{ filter: 'blur(8px)', opacity: 0.6 }}>
          <defs>
            <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7"/>
              <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7"/>
            </linearGradient>
          </defs>
          <path 
            d="M0,270 Q400,200 800,270 T1600,270 T2400,270 T3200,270 T4000,270 T4800,270 T5600,270 T6400,270 T7200,270 L7200,340 L0,340 Z" 
            fill="url(#waveGradient3)"
            style={{ animation: 'waveMove3 16s linear infinite' }}
          />
        </svg>
        {/* Layer 4 - Very Light Blue */}
        <svg className="absolute bottom-0 w-full h-full" style={{ filter: 'blur(6px)', opacity: 0.5 }}>
          <defs>
            <linearGradient id="waveGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.6"/>
              <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <path 
            d="M0,300 Q500,220 1000,300 T2000,300 T3000,300 T4000,300 T5000,300 T6000,300 T7000,300 T8000,300 T9000,300 L9000,340 L0,340 Z" 
            fill="url(#waveGradient4)"
            style={{ animation: 'waveMove4 19s linear infinite' }}
          />
        </svg>
        {/* Layer 5 - Accent Blue */}
        <svg className="absolute bottom-0 w-full h-full" style={{ filter: 'blur(7px)', opacity: 0.4 }}>
          <defs>
            <linearGradient id="waveGradient5" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.5"/>
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.5"/>
            </linearGradient>
          </defs>
          <path 
            d="M0,200 Q600,140 1200,200 T2400,200 T3600,200 T4800,200 T6000,200 T7200,200 T8400,200 T9600,200 T10800,200 L10800,340 L0,340 Z" 
            fill="url(#waveGradient5)"
            style={{ animation: 'waveMove5 23s linear infinite' }}
          />
        </svg>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start min-w-0">
            <div className="whitespace-nowrap">
              <div className="font-bold text-lg tracking-wide mb-2">SENTINEL</div>
              <div className="text-gray-400 text-base mb-6">The subscription manager<br />that makes your wallet :)</div>
            </div>
            <div className="whitespace-nowrap">
              <div className="font-bold text-white mb-2">Overview</div>
              <div className="text-gray-400 text-base">Product</div>
              <div className="text-gray-400 text-base">Security</div>
              <div className="text-gray-400 text-base">Pricing</div>
            </div>
            <div className="whitespace-nowrap">
              <div className="font-bold text-white mb-2">Company</div>
              <div className="text-gray-400 text-base">About</div>
              <div className="text-gray-400 text-base">Careers</div>
              <div className="text-gray-400 text-base">Press</div>
            </div>
            <div className="whitespace-nowrap">
              <div className="font-bold text-white mb-2">Legal</div>
              <div className="text-gray-400 text-base">Terms of Use</div>
              <div className="text-gray-400 text-base">Privacy</div>
              <div className="text-gray-400 text-base">Security</div>
            </div>
            <div className="whitespace-nowrap">
              <div className="font-bold text-white mb-2">Contact</div>
              <div className="text-gray-400 text-base">Email</div>
              <div className="text-gray-400 text-base">Instagram</div>
              <div className="text-gray-400 text-base">Tiktok</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 