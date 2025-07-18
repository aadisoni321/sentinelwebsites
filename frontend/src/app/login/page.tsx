"use client";

import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");
  const [loading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ fontFamily: 'Gabriel Sans, sans-serif' }}>
      {/* Blurred background */}
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-2xl" style={{ backgroundImage: 'url(/images/StudentStack - HAC.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)', opacity: 0.7 }} />
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-10 border border-gray-700 z-10 relative">
        <h1 className="text-4xl font-bold mb-8 text-center">Sign In to Sentinel</h1>
        <button
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-lg mb-6 border border-blue-500 hover:bg-blue-50 transition"
          style={{ boxShadow: '0 0 0 2px #2563eb' }}
          disabled={loading}
        >
          <img src="/logos/google.svg" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </button>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="mx-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="email"
              disabled
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="current-password"
              disabled
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="button"
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition opacity-60 cursor-not-allowed"
            disabled
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
} 