'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { 
  getAllCouponsAction, 
  createCouponAction, 
  updateCouponAction, 
  deleteCouponAction 
} from '@/lib/actions/checkout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Tag, 
  Calendar,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function CouponsClient() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  
  // Form state
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'flat'>('percentage');
  const [value, setValue] = useState('15');
  const [minOrder, setMinOrder] = useState('199');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [validFrom, setValidFrom] = useState(() => new Date().toISOString().substring(0, 10));
  const [validUntil, setValidUntil] = useState(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
  const [isActive, setIsActive] = useState(true);

  const loadCoupons = async () => {
    try {
      const res = await getAllCouponsAction();
      if (res.success && res.coupons) {
        setCoupons(res.coupons);
      } else {
        toast.error(res.error || 'Failed to load coupons');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenAddDialog = () => {
    setEditingCoupon(null);
    setCode('');
    setType('percentage');
    setValue('15');
    setMinOrder('199');
    setMaxDiscount('');
    setValidFrom(new Date().toISOString().substring(0, 10));
    setValidUntil(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
    setIsActive(true);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (c: any) => {
    setEditingCoupon(c);
    setCode(c.code);
    setType(c.type);
    setValue(String(c.value));
    setMinOrder(String(c.minOrder));
    setMaxDiscount(c.maxDiscount ? String(c.maxDiscount) : '');
    setValidFrom(new Date(c.validFrom).toISOString().substring(0, 10));
    setValidUntil(new Date(c.validUntil).toISOString().substring(0, 10));
    setIsActive(c.isActive);
    setDialogOpen(true);
  };

  const handleToggleActive = async (c: any) => {
    const nextVal = !c.isActive;
    setCoupons(prev => prev.map(item => item._id === c._id ? { ...item, isActive: nextVal } : item));
    
    try {
      const res = await updateCouponAction(c._id, { isActive: nextVal });
      if (res.success) {
        toast.success(`Coupon "${c.code}" is now ${nextVal ? 'active' : 'inactive'}`);
      } else {
        toast.error(res.error || 'Failed to update coupon');
        setCoupons(prev => prev.map(item => item._id === c._id ? { ...item, isActive: c.isActive } : item));
      }
    } catch {
      toast.error('Network error occurred');
      setCoupons(prev => prev.map(item => item._id === c._id ? { ...item, isActive: c.isActive } : item));
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${code}"?`)) return;

    toast.loading('Deleting coupon...', { id: 'delete' });
    try {
      const res = await deleteCouponAction(id);
      if (res.success) {
        toast.success('Coupon deleted successfully', { id: 'delete' });
        setCoupons(prev => prev.filter(item => item._id !== id));
      } else {
        toast.error(res.error || 'Failed to delete coupon', { id: 'delete' });
      }
    } catch {
      toast.error('Network error deleting coupon', { id: 'delete' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !type || !value || !minOrder || !validFrom || !validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrder: Number(minOrder),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      validFrom: new Date(validFrom).toISOString(),
      validUntil: new Date(validUntil).toISOString(),
      isActive,
    };

    setLoading(true);
    setDialogOpen(false);
    toast.loading(editingCoupon ? 'Saving coupon...' : 'Creating coupon...', { id: 'submit-cp' });

    try {
      let res;
      if (editingCoupon) {
        res = await updateCouponAction(editingCoupon._id, payload);
      } else {
        res = await createCouponAction(payload);
      }

      if (res.success) {
        toast.success(editingCoupon ? 'Coupon updated!' : 'Coupon created!', { id: 'submit-cp' });
        loadCoupons();
      } else {
        toast.error(res.error || 'Operation failed', { id: 'submit-cp' });
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error occurred', { id: 'submit-cp' });
      setLoading(false);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && coupons.length === 0) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search coupon code..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl h-10 border-border"
            />
          </div>

          <Button 
            onClick={handleOpenAddDialog}
            className="w-full sm:w-auto rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold h-10 border-0 flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Coupon
          </Button>
        </div>

        {/* Coupons list */}
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed text-muted-foreground text-xs leading-normal">
            No coupons found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCoupons.map((c) => (
              <Card 
                key={c._id} 
                className={`rounded-2xl border transition-all overflow-hidden flex flex-col ${
                  !c.isActive ? 'opacity-65 border-dashed bg-muted/5' : 'hover:shadow'
                }`}
              >
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-extrabold text-foreground tracking-wider uppercase">
                          {c.code}
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                          {c.type === 'percentage' ? `${c.value}% Off` : `₹${c.value} Flat Off`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/40 text-xs">
                    <div className="space-y-1">
                      <span className="text-muted-foreground block">Min Order</span>
                      <span className="font-bold text-foreground">₹{c.minOrder}</span>
                    </div>
                    {c.type === 'percentage' && c.maxDiscount && (
                      <div className="space-y-1 text-right">
                        <span className="text-muted-foreground block">Max Cap</span>
                        <span className="font-bold text-foreground">₹{c.maxDiscount}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Valid until: {new Date(c.validUntil).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground font-semibold">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={c.isActive} 
                        onCheckedChange={() => handleToggleActive(c)} 
                      />
                      <span>Active</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleOpenEditDialog(c)}
                        className="w-8 h-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(c._id, c.code)}
                        className="w-8 h-8 rounded-lg text-zinc-400 hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>

      {/* Add / Edit Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6 text-zinc-300">
          <DialogHeader>
            <DialogTitle className="font-heading text-base font-bold text-white">
              {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs py-2">
            {/* Code */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Coupon Code</label>
              <Input 
                placeholder="e.g. FESTIVE20" 
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount Type</label>
                <select 
                  value={type}
                  required
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:outline-none"
                >
                  <option value="percentage" className="bg-zinc-950">Percentage (%)</option>
                  <option value="flat" className="bg-zinc-950">Flat (₹)</option>
                </select>
              </div>

              {/* Value */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Discount Value</label>
                <Input 
                  type="number"
                  placeholder="e.g. 15" 
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Min Order */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Min Order (₹)</label>
                <Input 
                  type="number"
                  placeholder="e.g. 199" 
                  required
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>

              {/* Max Discount (Cap) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Max Cap (₹, Optional)</label>
                <Input 
                  type="number"
                  placeholder="e.g. 100" 
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                  disabled={type === 'flat'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Valid From */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Valid From</label>
                <Input 
                  type="date" 
                  required
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>

              {/* Valid Until */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Valid Until</label>
                <Input 
                  type="date" 
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>
            </div>

            {/* Active switch */}
            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              <span className="font-semibold text-zinc-400">Coupon Active Status</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <DialogFooter className="pt-2 border-t border-zinc-800">
              <Button 
                type="submit" 
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold h-10 border-0"
              >
                {editingCoupon ? 'Save Changes' : 'Create Coupon'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
