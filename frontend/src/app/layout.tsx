import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sentinel - Subscription Manager',
  description: 'They Hope You Forget. We Make Sure You Don\'t.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="font-sans bg-black text-white">
        {children}
      </body>
    </html>
  );
} 