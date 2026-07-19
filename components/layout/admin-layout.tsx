'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminNav } from '@/config/navigation.config';
import { siteConfig } from '@/config/site.config';
import { getCurrentUserAction, logoutAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { 
  UtensilsCrossed, 
  Menu, 
  X, 
  LogOut, 
  Home, 
  Bell, 
  User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getCurrentUserAction().then(user => {
      if (!user || user.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        router.push('/admin/login');
      } else {
        setAdmin(user);
      }
      setLoading(false);
    });
  }, [pathname, router]);

  const handleLogout = async () => {
    await logoutAction();
    toast.success('Admin logged out');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500 mb-4" />
          <p className="text-sm text-zinc-400 font-semibold">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-zinc-950 text-zinc-300 shrink-0">
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-zinc-900 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white">
            <UtensilsCrossed className="w-4 h-4 text-black" />
          </div>
          <div>
            <span className="font-heading text-base font-bold tracking-tight text-white block">
              {siteConfig.name}
            </span>
            <span className="text-[10px] text-amber-500 uppercase tracking-widest font-semibold block -mt-1">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive 
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10' 
                    : 'hover:bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-900 space-y-2">
          <Button variant="ghost" className="w-full justify-start rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold uppercase tracking-wider h-10" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Customer Site
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start rounded-xl text-destructive hover:bg-destructive/10 text-xs font-semibold uppercase tracking-wider h-10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 bg-card shrink-0">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="font-heading text-base md:text-lg font-bold tracking-tight text-foreground truncate">
              {adminNav.find(n => n.href === pathname)?.label || 'Control Panel'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                A
              </div>
              <span className="text-xs font-bold hidden sm:inline text-foreground">Admin Staff</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black"
            />
            {/* Drawer */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="relative w-64 bg-zinc-950 text-zinc-300 flex flex-col z-10 border-r"
            >
              <div className="h-16 px-6 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-black">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <span className="font-heading text-sm font-bold tracking-tight text-white">
                    Admin Portal
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        isActive 
                          ? 'bg-amber-500 text-black' 
                          : 'hover:bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-zinc-900 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white text-xs font-semibold uppercase tracking-wider h-10" asChild>
                  <Link href="/" onClick={() => setSidebarOpen(false)}>
                    <Home className="w-4 h-4 mr-2" />
                    Customer Site
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="w-full justify-start text-destructive hover:bg-destructive/10 text-xs font-semibold uppercase tracking-wider h-10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
