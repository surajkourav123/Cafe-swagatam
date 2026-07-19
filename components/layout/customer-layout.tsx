'use client';

import React from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { MobileNav } from './mobile-nav';
import { PageTransition } from '@/components/animations/page-transition';

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
