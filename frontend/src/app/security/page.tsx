"use client";

import React from 'react';
import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* STICKY NAVIGATION BAR */}
      <nav className="w-full flex items-center justify-between px-12 py-6 bg-black">
        <a href="/" className="text-lg font-semibold tracking-wide">SENTINEL</a>
        <div className="flex-1 flex justify-center space-x-16">
          <a href="/product" className="text-base font-normal text-gray-300 hover:text-white transition">Product</a>
          <a href="/security" className="text-base font-normal text-white border-b-2 border-white pb-1">Security</a>
          <a href="/pricing" className="text-base font-normal text-gray-300 hover:text-white transition">Pricing</a>
        </div>
        <Link href="/login">
          <button className="px-5 py-2 bg-white text-black font-semibold rounded border border-blue-500 hover:bg-blue-50 transition text-base" style={{ boxShadow: '0 0 0 2px #2563eb' }}>
            Get Started
          </button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center pt-24 pb-10 px-4 bg-black">
        <h1 className="text-6xl font-bold mb-4 leading-tight">
          Safe, Secure,<br />
          <span className="text-blue-500">And Private.</span>
        </h1>
        <p className="text-xl font-medium mb-8 mt-4 text-white">
          Sentinel secures your data, models, and knowledge with enterprise-grade security and compliance.
        </p>
        <button className="mx-auto text-base px-6 py-2 rounded border border-blue-500 text-black bg-white font-semibold shadow-sm hover:bg-blue-50 transition" style={{ boxShadow: '0 0 0 2px #2563eb' }}>
          Start Free Trial
        </button>
      </section>

      {/* SECURITY FEATURES GRID */}
      <section className="w-full px-16 pb-0 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-3 gap-16 mb-24 mt-16">
          <div className="flex flex-col items-start">
            <div className="mb-4 text-3xl">🙂</div>
            <div className="font-bold text-lg mb-1">No training on your data</div>
            <div className="text-base text-gray-300">We never use your private data to train or update our models.</div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-4 text-3xl">🌐</div>
            <div className="font-bold text-lg mb-1">Private data stays private</div>
            <div className="text-base text-gray-300">Data is stored in siloed environments, isolated from other customer data.</div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-4 text-3xl">👁️</div>
            <div className="font-bold text-lg mb-1">Full data visibility</div>
            <div className="text-base text-gray-300">Control data access and usage with full insight into your operations.</div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-4 text-3xl">🛡️</div>
            <div className="font-bold text-lg mb-1">Modern & secure data practices</div>
            <div className="text-base text-gray-300">Sentinel employs zero-trust, least privilege, and strong authentication.</div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-4 text-3xl">🔐</div>
            <div className="font-bold text-lg mb-1">Encrypted everywhere</div>
            <div className="text-base text-gray-300">Sentinel user data is securely managed across storage and networks.</div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-4 text-3xl">👁️</div>
            <div className="font-bold text-lg mb-1">Full data visibility</div>
            <div className="text-base text-gray-300">Control data access and usage with full insight into your operations.</div>
          </div>
        </div>
      </section>

      {/* COMPLIANCE SECTION */}
      <section className="w-full px-16 pb-0 max-w-[1600px] mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          Compliant With <span className="text-blue-500">Industry Standards</span>
        </h2>
        <div className="flex justify-center mb-16">
          <img src="/images/Screenshot 2025-07-17 at 7.44.12 PM.png" alt="Compliance Graphic" className="w-full max-w-5xl rounded-2xl border-2 border-dashed border-gray-600" />
        </div>
        <div className="max-w-6xl mx-auto flex flex-row gap-10 items-start text-left">
          <h3 className="font-bold text-white mb-0 text-2xl min-w-[320px]">Security At Our Core</h3>
          <div className="text-lg text-gray-300 space-y-4 flex-1">
            <p>
              At Sentinel, security isn't a feature—it's the foundation of trust we build with every user. From day one, we've embedded protection into every layer of our platform, applying zero-trust principles, end-to-end encryption, and rigorous access controls to safeguard your financial data.
            </p>
            <p>
              Our systems are constantly monitored and stress-tested to stay ahead of evolving threats. We use modern cloud infrastructure, automated security tooling, and independent audits to ensure your most sensitive information remains secure—always.
            </p>
            <p>
              Your financial privacy is sacred. We don't just meet industry standards—we exceed them, because your money deserves nothing less.
            </p>
          </div>
        </div>
      </section>

      {/* GET STARTED FOR FREE SECTION */}
      <section className="text-center py-24 px-4 bg-black text-white">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Get Started For <span className="text-blue-500">Free</span>
        </h2>
        <p className="text-lg md:text-xl font-medium mb-10">
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
        {/* ANIMATED LAYERED WAVE (ultra-complex, seamless, glowing, flowing) */}
        <div className="relative w-full overflow-hidden mt-12" style={{ height: '340px', marginBottom: '-2px', background: 'transparent' }}>
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
      </section>

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