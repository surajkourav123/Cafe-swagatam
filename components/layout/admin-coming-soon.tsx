'use client';

import React from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Wrench, ArrowLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface AdminComingSoonProps {
  title: string;
}

export function AdminComingSoon({ title }: AdminComingSoonProps) {
  return (
    <AdminLayout>
      <div className="h-[65vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-card border rounded-3xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500 animate-bounce">
            <Wrench className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-heading text-xl font-bold text-foreground">{title} Module</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Our engineering team is building this workspace. In the meantime, you can manage orders, toggle menu availability, and track site metrics.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline" className="rounded-xl h-10 px-6 font-semibold">
              <Link href="/admin/dashboard" className="flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold h-10 px-6 border-0">
              <Link href="/admin/orders" className="flex items-center gap-1">
                Orders
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
