'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/context/cart-context';
import { customerMobileNav } from '@/config/navigation.config';
import { motion } from 'framer-motion';
import { User, LogIn } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const { summary } = useCart();
  
  // We check if it's an admin path to hide this on admin panel
  if (!pathname || pathname.startsWith('/admin')) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-stone-200 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] pb-safe pt-2 px-2">
      <nav className="flex items-center justify-around">
        {customerMobileNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative flex flex-col items-center justify-center p-2 min-w-[64px]"
            >
              <div className="relative">
                <Icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                {item.label === 'Cart' && summary.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-stone-950 text-[9px] font-bold text-white border-2 border-white animate-in zoom-in duration-300">
                    {summary.itemCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-1 transition-colors duration-300 ${isActive ? 'text-stone-950' : 'text-stone-400'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-2 w-8 h-1 bg-stone-900 rounded-b-full shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
