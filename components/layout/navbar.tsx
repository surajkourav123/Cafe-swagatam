'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/context/cart-context';
import { getCurrentUserAction, logoutAction } from '@/lib/actions/auth';
import { siteConfig } from '@/config/site.config';
import { customerNav } from '@/config/navigation.config';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  UtensilsCrossed, 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function Navbar() {
  const pathname = usePathname();
  const { summary, clearCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Fetch current user
    getCurrentUserAction().then(setUser);

    // Track scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.success) {
      setUser(null);
      clearCart();
      toast.success('Logged out successfully');
      window.location.href = '/';
    } else {
      toast.error('Logout failed');
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-350 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-3' 
          : 'bg-white py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
            <Image src="/images/logo.png" alt="Swagatam Cafe Logo" width={48} height={48} className="object-contain" />
          </div>
          <div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground group-hover:text-amber-500 transition-colors">
              {siteConfig.name}
            </span>
            <span className="block text-[10px] text-muted-foreground uppercase tracking-widest font-medium -mt-1">
              Gadarwara
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {customerNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive 
                    ? 'text-stone-900 font-semibold' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {isActive && (
                  <motion.span 
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-stone-100 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4" />
                {item.label}
                {item.label === 'Cart' && summary.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-stone-950 text-[9px] font-bold text-white ring-2 ring-white">
                    {summary.itemCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center space-x-2">
              {user.role === 'admin' && (
                <Button variant="outline" size="sm" asChild className="border-stone-200 text-stone-700 hover:bg-stone-50">
                  <Link href="/admin/dashboard" className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
              )}
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 hover:bg-stone-100 border border-stone-200 text-sm font-medium transition-colors">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xs text-white font-bold uppercase">
                  {user.name[0]}
                </div>
                <span className="max-w-[100px] truncate text-stone-800">{user.name.split(' ')[0]}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Log Out" className="text-stone-400 hover:text-red-650">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button asChild className="rounded-full bg-stone-900 hover:bg-stone-800 text-white border-0 h-10 px-5 shadow-sm transition-all cursor-pointer">
              <Link href="/profile" className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                Login / Sign Up
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Link href="/cart" className="relative p-2 text-stone-500 hover:text-stone-900">
            <ShoppingCart className="w-6 h-6" />
            {summary.itemCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-stone-950 text-[8px] font-bold text-white">
                {summary.itemCount}
              </span>
            )}
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden w-full bg-background border-b overflow-hidden mt-3 px-4 pb-6"
          >
            <div className="flex flex-col space-y-3">
              {customerNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive 
                        ? 'bg-stone-100 text-stone-900' 
                        : 'hover:bg-stone-50 text-stone-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.label === 'Cart' && summary.itemCount > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-stone-950 text-[10px] font-bold text-white">
                        {summary.itemCount}
                      </span>
                    )}
                  </Link>
                );
              })}
              
              <hr className="my-2 border-stone-200" />
              
              {user ? (
                <div className="space-y-3">
                  {user.role === 'admin' && (
                    <Link 
                      href="/admin/dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-stone-900 hover:bg-stone-100"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <div className="flex items-center justify-between px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-sm text-white font-bold uppercase">
                        {user.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{user.name}</span>
                        <span className="text-xs text-stone-500">{user.phone}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button asChild className="w-full rounded-xl bg-stone-900 hover:bg-stone-800 text-white cursor-pointer">
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-4 h-4 mr-2" />
                    Login / Register
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
