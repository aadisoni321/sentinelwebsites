"use client";

import React from 'react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
      {/* NAVIGATION BAR */}
      <nav className="w-full flex items-center justify-between px-12 py-6 bg-black">
        <a href="/" className="text-lg font-semibold tracking-wide">SENTINEL</a>
        <div className="flex-1 flex justify-center space-x-16">
          <a href="/product" className="text-base font-normal text-gray-300 hover:text-white transition">Product</a>
          <a href="/security" className="text-base font-normal text-gray-300 hover:text-white transition">Security</a>
          <a href="/pricing" className="text-base font-normal text-white border-b-2 border-white pb-1">Pricing</a>
        </div>
        <Link href="/login">
          <button className="px-5 py-2 bg-white text-black font-semibold rounded border border-blue-500 hover:bg-blue-50 transition text-base" style={{ boxShadow: '0 0 0 2px #2563eb' }}>
            Get Started
          </button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center pt-20 pb-8 px-4 bg-black">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-2 leading-tight">
            Get the #1<br />
            <span className="text-blue-500">AI subscription system</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-4 text-white" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
            Get started for Free. Upgrade to increase limits.
          </p>
        </div>
      </section>

      {/* PRICING CARDS SECTION */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-2">
              Simple, <span className="text-blue-500">Transparent</span> Pricing
            </h2>
            <p className="text-xl md:text-2xl font-medium text-gray-300 max-w-4xl mx-auto" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
              Choose the plan that fits your needs. No hidden fees, no surprises.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white text-black rounded-3xl p-10 flex flex-col items-center shadow-2xl hover:shadow-3xl transition relative" style={{ minHeight: '600px' }}>
              <div className="font-bold text-2xl mb-4">Free</div>
              <div className="text-6xl font-bold mb-2">$0</div>
              <div className="text-lg text-gray-600 mb-8">Forever</div>
              <ul className="mb-10 text-left text-lg space-y-4 w-full">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  Up to 5 subscriptions
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  Basic AI insights
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  Email support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  Mobile app access
                </li>
              </ul>
              <div className="absolute bottom-8 left-0 w-full flex justify-center">
                <button className="w-4/5 bg-gray-200 text-black text-xl font-bold py-4 rounded-xl hover:bg-gray-300 transition">
                  Get Started Free
                </button>
              </div>
            </div>
            {/* Pro Plan */}
            <div className="bg-white text-black rounded-3xl p-10 flex flex-col items-center shadow-2xl hover:shadow-3xl transition border-4 border-blue-500 relative" style={{ minHeight: '600px' }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="font-bold text-2xl mb-4">Pro</div>
              <div className="text-6xl font-bold mb-2">$20</div>
              <div className="text-lg text-gray-600 mb-8">per month</div>
              <ul className="mb-10 text-left text-lg space-y-4 w-full">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  Unlimited subscriptions
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  Advanced AI insights
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  Wealth building tools
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  Custom alerts
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  API access
                </li>
              </ul>
              <div className="absolute bottom-8 left-0 w-full flex justify-center">
                <button className="w-4/5 bg-blue-500 text-white text-xl font-bold py-4 rounded-xl hover:bg-blue-600 transition">
                  Start Pro Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARING VERSIONS SECTION */}
      <section className="py-20 px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Comparing <span className="text-blue-500">Versions</span>
            </h2>
            <p className="text-xl md:text-2xl font-light text-gray-300 max-w-4xl mx-auto" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
              See exactly what you get with each plan
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-6 text-xl font-bold">Feature</th>
                  <th className="py-6 text-xl font-bold text-center">Free</th>
                  <th className="py-6 text-xl font-bold text-center">Pro</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                <tr className="border-b border-gray-800">
                  <td className="py-6 text-lg">Subscription Tracking</td>
                  <td className="py-6 text-center text-green-500 text-2xl">✓</td>
                  <td className="py-6 text-center text-green-500 text-2xl">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-6 text-lg">AI Insights</td>
                  <td className="py-6 text-center text-gray-400">Basic</td>
                  <td className="py-6 text-center text-green-500 text-2xl">Advanced</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-6 text-lg">Wealth Building</td>
                  <td className="py-6 text-center text-red-500 text-2xl">✗</td>
                  <td className="py-6 text-center text-green-500 text-2xl">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-6 text-lg">Custom Alerts</td>
                  <td className="py-6 text-center text-red-500 text-2xl">✗</td>
                  <td className="py-6 text-center text-green-500 text-2xl">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-6 text-lg">API Access</td>
                  <td className="py-6 text-center text-red-500 text-2xl">✗</td>
                  <td className="py-6 text-center text-green-500 text-2xl">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-6 text-lg">Support</td>
                  <td className="py-6 text-center">Email</td>
                  <td className="py-6 text-center">Priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-center">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h2>
          <div className="space-y-6">
            {/* FAQ Dropdowns */}
            {[
              {
                q: 'How does Sentinel detect my subscriptions?',
                a: 'Sentinel uses secure, read-only access to your email and bank transactions to automatically identify recurring payments and subscription emails. Our AI matches patterns and vendors to build your subscription list—no manual entry required.'
              },
              {
                q: 'Can I cancel my Pro subscription anytime?',
                a: 'Yes! You can cancel your Pro subscription at any time from your account settings. Your plan will remain active until the end of your billing cycle, and you can always downgrade to Free.'
              },
              {
                q: 'Is my financial data secure?',
                a: 'Absolutely. We use bank-level encryption, zero-trust architecture, and never share or sell your data. Your privacy and security are our top priorities.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, Apple Pay, Google Pay, and ACH bank transfers for Pro subscriptions.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'If you’re not satisfied, contact us within 14 days of your first Pro payment for a full refund—no questions asked.'
              },
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes, you can upgrade or downgrade between Free and Pro at any time. Changes take effect immediately, and you’ll only be charged for the days you use Pro.'
              },
              {
                q: 'Is there a free trial for Pro?',
                a: 'Yes! Every new user gets a 7-day free trial of Pro—no credit card required.'
              },
              {
                q: 'How do I contact support?',
                a: 'You can reach us anytime at usesentinel@gmail.com or through the in-app chat. Our team responds within 24 hours.'
              }
            ].map((item, idx) => (
              <FAQItem key={idx} question={item.q} answer={item.a} />
            ))}
          </div>
          <div className="text-center text-gray-400 text-lg mt-12">
            <p>
              Want to know more about Pricing? Contact us by{' '}
              <a href="mailto:usesentinel@gmail.com" className="text-blue-500 underline hover:text-blue-400">
                usesentinel@gmail.com
              </a>
              ,{' '}
              <a href="#" className="text-blue-500 underline hover:text-blue-400">
                read our docs
              </a>
              , or view{' '}
              <a href="#" className="text-blue-500 underline hover:text-blue-400">
                terms of service
              </a>
              .
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

// FAQItem component
function FAQItem({ question, answer }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="bg-gray-900 text-white rounded-2xl p-8 hover:bg-gray-800 transition cursor-pointer" onClick={() => setOpen(o => !o)}>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>{question}</span>
        <span className="text-3xl text-blue-500">{open ? '-' : '+'}</span>
      </div>
      {open && (
        <div className="mt-6 text-lg text-gray-300" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
          {answer}
        </div>
      )}
    </div>
  );
} 