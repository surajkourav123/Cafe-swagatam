'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { 
  getAllDeliveryAreasAction, 
  createDeliveryAreaAction, 
  updateDeliveryAreaAction, 
  deleteDeliveryAreaAction 
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
  MapPin,
  Clock,
  IndianRupee
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function DeliveryClient() {
  const [deliveryAreas, setDeliveryAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<any>(null);
  
  // Form state
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('487551');
  const [deliveryCharge, setDeliveryCharge] = useState('0');
  const [estimatedTime, setEstimatedTime] = useState('15');
  const [isActive, setIsActive] = useState(true);

  const loadDeliveryAreas = async () => {
    try {
      const res = await getAllDeliveryAreasAction();
      if (res.success && res.deliveryAreas) {
        setDeliveryAreas(res.deliveryAreas);
      } else {
        toast.error(res.error || 'Failed to load delivery areas');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveryAreas();
  }, []);

  const handleOpenAddDialog = () => {
    setEditingArea(null);
    setVillage('');
    setPincode('487551');
    setDeliveryCharge('0');
    setEstimatedTime('15');
    setIsActive(true);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (da: any) => {
    setEditingArea(da);
    setVillage(da.village);
    setPincode(da.pincode);
    setDeliveryCharge(String(da.deliveryCharge));
    setEstimatedTime(String(da.estimatedTime));
    setIsActive(da.isActive);
    setDialogOpen(true);
  };

  const handleToggleActive = async (da: any) => {
    const nextVal = !da.isActive;
    setDeliveryAreas(prev => prev.map(item => item._id === da._id ? { ...item, isActive: nextVal } : item));
    
    try {
      const res = await updateDeliveryAreaAction(da._id, { isActive: nextVal });
      if (res.success) {
        toast.success(`Area "${da.village}" is now ${nextVal ? 'active' : 'inactive'}`);
      } else {
        toast.error(res.error || 'Failed to update delivery area');
        setDeliveryAreas(prev => prev.map(item => item._id === da._id ? { ...item, isActive: da.isActive } : item));
      }
    } catch {
      toast.error('Network error occurred');
      setDeliveryAreas(prev => prev.map(item => item._id === da._id ? { ...item, isActive: da.isActive } : item));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete delivery area "${name}"?`)) return;

    toast.loading('Deleting delivery area...', { id: 'delete' });
    try {
      const res = await deleteDeliveryAreaAction(id);
      if (res.success) {
        toast.success('Delivery area deleted successfully', { id: 'delete' });
        setDeliveryAreas(prev => prev.filter(item => item._id !== id));
      } else {
        toast.error(res.error || 'Failed to delete delivery area', { id: 'delete' });
      }
    } catch {
      toast.error('Network error deleting delivery area', { id: 'delete' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!village.trim() || !pincode.trim() || !deliveryCharge || !estimatedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      village: village.trim(),
      pincode: pincode.trim(),
      deliveryCharge: Number(deliveryCharge),
      estimatedTime: Number(estimatedTime),
      isActive,
    };

    setLoading(true);
    setDialogOpen(false);
    toast.loading(editingArea ? 'Saving delivery area...' : 'Creating delivery area...', { id: 'submit-da' });

    try {
      let res;
      if (editingArea) {
        res = await updateDeliveryAreaAction(editingArea._id, payload);
      } else {
        res = await createDeliveryAreaAction(payload);
      }

      if (res.success) {
        toast.success(editingArea ? 'Delivery area updated!' : 'Delivery area created!', { id: 'submit-da' });
        loadDeliveryAreas();
      } else {
        toast.error(res.error || 'Operation failed', { id: 'submit-da' });
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error occurred', { id: 'submit-da' });
      setLoading(false);
    }
  };

  const filteredAreas = deliveryAreas.filter(da => 
    da.village.toLowerCase().includes(search.toLowerCase()) ||
    da.pincode.includes(search)
  );

  if (loading && deliveryAreas.length === 0) {
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
              placeholder="Search by location name..." 
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
            Add Delivery Area
          </Button>
        </div>

        {/* Delivery Areas list */}
        {filteredAreas.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed text-muted-foreground text-xs leading-normal">
            No delivery areas found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAreas.map((da) => (
              <Card 
                key={da._id} 
                className={`rounded-2xl border transition-all overflow-hidden flex flex-col ${
                  !da.isActive ? 'opacity-65 border-dashed bg-muted/5' : 'hover:shadow'
                }`}
              >
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-foreground">
                          {da.village}
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          PIN: {da.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/40 text-xs">
                    <div className="space-y-1">
                      <span className="text-muted-foreground block">Delivery Charge</span>
                      <span className="font-bold text-foreground flex items-center gap-0.5">
                        ₹{da.deliveryCharge === 0 ? 'FREE' : da.deliveryCharge}
                      </span>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-muted-foreground block">Est. Time</span>
                      <span className="font-bold text-foreground flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {da.estimatedTime} mins
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground font-semibold">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={da.isActive} 
                        onCheckedChange={() => handleToggleActive(da)} 
                      />
                      <span>Active</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleOpenEditDialog(da)}
                        className="w-8 h-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(da._id, da.village)}
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
              {editingArea ? 'Edit Delivery Area' : 'Create Delivery Area'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs py-2">
            {/* Village / Area Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Village / Area Name (Chichli)</label>
              <Input 
                placeholder="e.g. Civil Lines" 
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Pincode */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Pincode</label>
                <Input 
                  placeholder="e.g. 487551" 
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>

              {/* Delivery Charge */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Delivery Charge (₹)</label>
                <Input 
                  type="number"
                  placeholder="e.g. 20" 
                  required
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>
            </div>

            {/* Estimated time */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Estimated Delivery Time (Mins)</label>
              <Input 
                type="number"
                placeholder="e.g. 20" 
                required
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
              />
            </div>

            {/* Active switch */}
            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              <span className="font-semibold text-zinc-400">Area Deliverable Status</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <DialogFooter className="pt-2 border-t border-zinc-800">
              <Button 
                type="submit" 
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold h-10 border-0"
              >
                {editingArea ? 'Save Changes' : 'Create Delivery Area'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
