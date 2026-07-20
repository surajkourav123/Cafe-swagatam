'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminLoginAction, getCurrentUserAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Mail, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // If already logged in as admin, redirect immediately
    getCurrentUserAction().then(user => {
      if (user && user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setSubmitting(true);
    toast.loading('Logging in...', { id: 'admin-login' });

    try {
      const res = await adminLoginAction({ email, password });
      if (res.success) {
        toast.success('Admin login successful!', { id: 'admin-login' });
        router.push('/admin/dashboard');
      } else {
        toast.error(res.error || 'Invalid credentials', { id: 'admin-login' });
        setSubmitting(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed', { id: 'admin-login' });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/10">
            <Shield className="w-6 h-6 text-black animate-pulse" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
              Staff Portal
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Enter your credentials to access the admin dashboard
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl overflow-hidden text-zinc-300">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input 
                    type="email"
                    required
                    placeholder="admin@swagatamcafe.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase">Secret Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold h-11 border-0 shadow mt-2"
              >
                {submitting ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>



      </div>
    </div>
  );
}
