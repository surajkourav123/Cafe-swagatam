'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { getAllOrdersAction, updateOrderStatusAction } from '@/lib/actions/orders';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { ORDER_STATUSES } from '@/config/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function OrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const loadOrders = async () => {
    try {
      const res = await getAllOrdersAction();
      if (res.success && res.orders) {
        setOrders(res.orders);
      } else {
        toast.error(res.error || 'Failed to fetch orders');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // Poll for new orders every 12 seconds
    const interval = setInterval(loadOrders, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId: string, status: string, note?: string) => {
    toast.loading('Updating order status...', { id: 'status-update' });
    try {
      const res = await updateOrderStatusAction(orderId, status, note);
      if (res.success && res.order) {
        toast.success(`Order status updated to ${status.replace('_', ' ')}!`, { id: 'status-update' });
        
        // Refresh local state
        setOrders(prev => prev.map(o => o._id === orderId ? res.order : o));
        
        // If the updated order is currently selected in dialog, refresh it too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.order);
        }
      } else {
        toast.error(res.error || 'Failed to update order status', { id: 'status-update' });
      }
    } catch (error: any) {
      toast.error(error.message || 'Error updating status', { id: 'status-update' });
    }
  };

  const filteredOrders = orders.filter(o => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled';
    return o.status === activeFilter;
  });

  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500" />
        </div>
      </AdminLayout>
    );
  }

  const filters = [
    { key: 'all', label: 'All Orders' },
    { key: 'active', label: 'Active / Pending' },
    { key: 'pending', label: 'Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Filters strip */}
        <div className="flex overflow-x-auto pb-2 gap-1.5 scrollbar-thin select-none no-scrollbar">
          {filters.map(f => (
            <Button
              key={f.key}
              variant={activeFilter === f.key ? 'default' : 'outline'}
              onClick={() => setActiveFilter(f.key)}
              size="sm"
              className={`rounded-xl shrink-0 h-9 font-semibold text-xs ${
                activeFilter === f.key 
                  ? 'bg-amber-500 hover:bg-amber-600 text-black border-0' 
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
              {f.key === 'active' && orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length > 0 && (
                <Badge className="ml-1.5 bg-black text-amber-500 hover:bg-black font-extrabold h-4 px-1 text-[9px]">
                  {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Orders list grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed text-muted-foreground text-xs leading-normal">
            No orders found matching this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredOrders.map((ord: any) => {
              const statusInfo = ORDER_STATUSES[ord.status as keyof typeof ORDER_STATUSES];
              
              return (
                <Card 
                  key={ord._id} 
                  className="rounded-2xl border hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Card header */}
                  <div className="bg-muted/20 p-4 border-b flex items-center justify-between gap-3 text-xs">
                    <div className="font-mono font-bold text-foreground text-sm">
                      {ord.orderId}
                    </div>
                    <Badge className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      ord.status === 'cancelled' 
                        ? 'bg-destructive/10 text-destructive border-destructive/20' 
                        : ord.status === 'delivered' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                    }`}>
                      {statusInfo?.label || ord.status}
                    </Badge>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-4 flex-1 space-y-4 text-xs">
                    {/* Customer */}
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-sm">{ord.address.name}</p>
                      <p className="text-muted-foreground font-medium flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {ord.address.phone}
                      </p>
                      <p className="text-muted-foreground leading-normal flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {ord.address.address}, {ord.address.village}
                      </p>
                    </div>

                    {/* Items snippet */}
                    <div className="p-3 bg-muted/40 rounded-xl space-y-1.5 border">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Dishes Ordered</p>
                      <ul className="space-y-1">
                        {ord.items.map((it: any, idx: number) => (
                          <li key={idx} className="flex justify-between items-center text-foreground font-semibold">
                            <span>{it.name} x{it.quantity}</span>
                            <span className="font-mono text-muted-foreground text-[10px]">₹{it.price * it.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timeline and Payment info */}
                    <div className="flex justify-between text-muted-foreground border-t pt-3">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-500">PLACED AT</p>
                        <p className="font-medium mt-0.5">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-zinc-500">TOTAL BILL</p>
                        <p className="font-bold text-sm text-amber-500 mt-0.5">₹{ord.total}</p>
                      </div>
                    </div>
                  </CardContent>

                  {/* Action buttons */}
                  <div className="p-4 bg-muted/10 border-t flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedOrder(ord)}
                      className="flex-1 rounded-xl text-xs font-semibold h-8"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View Details
                    </Button>
                    
                    {/* Quick advance status controls */}
                     {ord.status === 'pending' && ord.paymentMethod === 'cod' && (
                       <Button 
                         size="sm" 
                         onClick={() => handleStatusUpdate(ord._id, 'confirmed', 'Staff confirmed order')}
                         className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold h-8 border-0"
                       >
                         Confirm
                       </Button>
                     )}
                     {ord.status === 'pending' && ord.paymentMethod === 'upi' && (
                       <Button 
                         size="sm" 
                         onClick={() => handleStatusUpdate(ord._id, 'payment_verification', 'Checking payment reference')}
                         className="rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold h-8 border-0"
                       >
                         Verify UPI
                       </Button>
                     )}
                     {ord.status === 'payment_verification' && (
                       <Button 
                         size="sm" 
                         onClick={() => handleStatusUpdate(ord._id, 'confirmed', 'Payment verified and order confirmed')}
                         className="rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold h-8 border-0 animate-pulse"
                       >
                         Approve Payment
                       </Button>
                     )}
                    {ord.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(ord._id, 'preparing', 'Chef is preparing your meal')}
                        className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold h-8 border-0"
                      >
                        Prepare
                      </Button>
                    )}
                    {ord.status === 'preparing' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(ord._id, 'ready', 'Your order is ready')}
                        className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold h-8 border-0"
                      >
                        Ready
                      </Button>
                    )}
                    {ord.status === 'ready' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(ord._id, 'out_for_delivery', 'Delivery partner is on the way')}
                        className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold h-8 border-0"
                      >
                        Ship
                      </Button>
                    )}
                    {ord.status === 'out_for_delivery' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(ord._id, 'delivered', 'Order successfully delivered')}
                        className="rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold h-8 border-0"
                      >
                        Deliver
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </div>

      {/* Details Dialog */}
      <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-zinc-300">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-lg font-bold text-white flex items-center justify-between">
                  <span>Order Details</span>
                  <span className="font-mono text-xs text-zinc-500">ID: {selectedOrder.orderId}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 text-xs py-2">
                {/* Customer Details */}
                <div className="space-y-1">
                  <h4 className="font-bold text-[10px] text-amber-500 uppercase tracking-widest">Recipient Info</h4>
                  <p className="font-bold text-sm text-white">{selectedOrder.address.name}</p>
                  <p className="font-semibold text-zinc-400">Phone: {selectedOrder.address.phone}</p>
                  <p className="text-zinc-400 leading-relaxed">
                    Address: {selectedOrder.address.address}, {selectedOrder.address.village}
                  </p>
                  {selectedOrder.address.landmark && (
                    <p className="text-zinc-500">Landmark: {selectedOrder.address.landmark}</p>
                  )}
                  {selectedOrder.notes && (
                    <p className="text-amber-500 font-medium">Notes: "{selectedOrder.notes}"</p>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[10px] text-amber-500 uppercase tracking-widest">Ordered Items</h4>
                  <div className="divide-y divide-zinc-800 border rounded-xl overflow-hidden bg-zinc-950 p-3">
                    {selectedOrder.items.map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0 font-semibold text-white">
                        <span>{it.name} <span className="text-amber-500 font-bold text-[10px]">x{it.quantity}</span></span>
                        <span className="font-mono text-zinc-400">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 border-t border-zinc-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Items Subtotal</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Promo Discount</span>
                      <span>-₹{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Delivery Charge</span>
                    <span>₹{selectedOrder.deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tax (5%)</span>
                    <span>₹{selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-white border-t border-zinc-800 pt-2">
                    <span>Total Bill</span>
                    <span className="text-amber-500">₹{selectedOrder.total}</span>
                  </div>
                </div>

                {/* Payment detail */}
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <p className="font-bold text-[10px] text-amber-500 uppercase">Payment details</p>
                  <p className="font-bold text-white uppercase">{selectedOrder.paymentMethod} - {selectedOrder.paymentStatus.replace('_', ' ')}</p>
                  {selectedOrder.upiPaymentInfo?.transactionId && (
                    <p className="font-mono text-[10px] text-zinc-400 mt-1">
                      UPI Ref No: <span className="text-white font-bold">{selectedOrder.upiPaymentInfo.transactionId}</span>
                    </p>
                  )}
                </div>

                {/* Action dropdown */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[10px] text-amber-500 uppercase tracking-widest">Update Order Status</h4>
                  <div className="flex gap-2">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value, 'Status updated via detailed dashboard')}
                      className="w-full flex h-10 items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none"
                    >
                      {Object.entries(ORDER_STATUSES).map(([key, info]) => (
                        <option key={key} value={key} className="bg-zinc-950 text-white">
                          {info.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              <DialogFooter className="pt-2 border-t border-zinc-800 gap-2">
                <Button 
                  onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled', 'Order cancelled by staff')}
                  variant="outline" 
                  size="sm"
                  className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 text-xs font-semibold h-9"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Cancel Order
                </Button>
                <Button 
                  onClick={() => setSelectedOrder(null)}
                  size="sm"
                  className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white h-9 text-xs font-semibold border-0"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
}
