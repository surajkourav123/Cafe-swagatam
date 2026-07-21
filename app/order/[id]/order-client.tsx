'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/customer-layout';
import { getOrderByIdAction } from '@/lib/actions/orders';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ORDER_STATUSES, ORDER_TRACKING_STEPS } from '@/config/constants';
import { siteConfig } from '@/config/site.config';
import { 
  ClipboardCheck, 
  CreditCard, 
  CheckCircle, 
  ChefHat, 
  Package, 
  Truck, 
  PartyPopper,
  AlertCircle,
  Calendar,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Map string icon names to Lucide icons
const iconMap: Record<string, React.ComponentType<any>> = {
  ClipboardCheck,
  CreditCard,
  CheckCircle,
  ChefHat,
  Package,
  Truck,
  PartyPopper,
};

interface OrderClientProps {
  orderId: string;
}

export function OrderClient({ orderId }: OrderClientProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Poll for status updates every 10 seconds (gives a premium live tracking feel!)
  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      try {
        const res = await getOrderByIdAction(orderId);
        if (res.success && active) {
          setOrder(res.order);
        } else if (active) {
          toast.error(res.error || 'Failed to sync order details');
        }
      } catch (error: any) {
        if (active) toast.error(error.message || 'Error fetching order');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orderId]);

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-stone-900 mb-4" />
            <p className="text-sm text-stone-500 font-semibold">Loading order details...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (!order) {
    return (
      <CustomerLayout>
        <div className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight mb-2 text-stone-900">Order Not Found</h1>
            <p className="text-sm text-stone-500 mb-8 leading-relaxed">
              We couldn&apos;t find an order with this ID. If you just placed it, it might take a moment to sync.
            </p>
            <Button asChild className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold cursor-pointer">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  // Filter tracking steps based on payment method (hide payment verification for COD)
  const trackingSteps = ORDER_TRACKING_STEPS.filter(
    step => step.key !== 'payment_verification' || order.paymentMethod === 'upi'
  );
  
  // Find current step index in the filtered steps list
  const currentStepInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
  const currentStepIndex = trackingSteps.findIndex(step => step.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <CustomerLayout>
      <section className="bg-[#FCFBF9] border-b border-stone-200/60 py-10 text-stone-900">
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/order" className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-stone-900">
                Order Tracking
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-2 font-mono ml-8">
              ID: {order.orderId}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center ml-8 sm:ml-0">
            <Badge className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              isCancelled 
                ? 'bg-red-50 text-red-650 border border-red-200/50' 
                : order.status === 'delivered' 
                  ? 'bg-green-50 text-green-700 border border-green-200/50'
                  : 'bg-amber-50 text-amber-850 border border-amber-200/50 animate-pulse'
            }`}>
              {currentStepInfo?.label || order.status}
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Progress step list + Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Live Progress Tracker Card */}
            {!isCancelled ? (
              <Card className="rounded-2xl border border-stone-200/80 shadow-sm bg-white overflow-hidden">
                <div className="bg-stone-50/50 p-6 border-b border-stone-100">
                  <h3 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700" />
                    Live Delivery Progress
                  </h3>
                </div>
                <CardContent className="p-6">
                  {/* Progress Line and Nodes */}
                  <div className="relative flex flex-col space-y-8">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-stone-100 -z-10" />
                    <div 
                      className="absolute left-[19px] top-4 w-0.5 bg-stone-905 -z-10 transition-all duration-700" 
                      style={{ height: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
                    />

                    {trackingSteps.map((step, idx) => {
                      const Icon = iconMap[step.icon] || ClipboardCheck;
                      const isCompleted = idx <= currentStepIndex;
                      const isActive = idx === currentStepIndex;
                      
                      return (
                        <div key={step.key} className="flex gap-4 items-center">
                          {/* Circle Icon Node */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border z-10 transition-all duration-300 ${
                            isActive
                              ? 'bg-stone-950 text-white border-stone-950 shadow scale-110 font-bold'
                              : isCompleted
                                ? 'bg-stone-100 text-stone-705 border-stone-200'
                                : 'bg-stone-50 text-stone-300 border-stone-100'
                          }`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>

                          {/* Text description */}
                          <div>
                            <p className={`font-semibold text-sm ${isActive ? 'text-stone-950 font-bold' : isCompleted ? 'text-stone-800' : 'text-stone-400'}`}>
                              {step.label}
                            </p>
                            {isActive && (
                              <p className="text-xs text-stone-500 mt-0.5">
                                {order.statusHistory.find((h: any) => h.status === step.key)?.note || 'We are working on this stage.'}
                              </p>
                            )}
                            {!isActive && isCompleted && (
                              <p className="text-[11px] text-stone-400 mt-0.5">
                                Completed at {new Date(order.statusHistory.find((h: any) => h.status === step.key)?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border border-red-200 bg-red-50/30 overflow-hidden">
                <CardContent className="p-8 text-center space-y-4">
                  <XCircle className="w-16 h-16 text-red-650 mx-auto animate-bounce" />
                  <h3 className="font-heading text-xl font-bold text-red-650">This order has been cancelled</h3>
                  <p className="text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
                    Reason: {order.statusHistory.find((h: any) => h.status === 'cancelled')?.note || 'Cancelled by staff or user request.'}
                  </p>
                  <Button asChild variant="outline" className="rounded-xl border-red-200 text-red-650 hover:bg-red-50 mt-2 cursor-pointer">
                    <Link href="/menu">Return to Menu</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Address & Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Delivery Address */}
              <Card className="rounded-2xl border border-stone-200/80 shadow-sm bg-white">
                <CardContent className="p-5 space-y-3">
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <MapPin className="w-4.5 h-4.5 text-amber-700" />
                    Delivery Destination
                  </h4>
                  <div className="text-sm space-y-1.5 text-stone-700">
                    <p className="font-semibold text-stone-900">{order.address.name}</p>
                    <p className="text-stone-500 font-medium">{order.address.phone}</p>
                    <p className="text-stone-500 leading-snug mt-2">
                      {order.address.address}
                    </p>
                    {order.address.landmark && (
                      <p className="text-xs text-stone-400 bg-stone-50 border border-stone-200/60 p-2 rounded-lg inline-block">
                        <span className="font-bold text-stone-850">Landmark:</span> {order.address.landmark}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Estimation */}
              <Card className="rounded-2xl border border-stone-200/80 shadow-sm bg-white">
                <CardContent className="p-5 space-y-3">
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <Clock className="w-4.5 h-4.5 text-amber-700" />
                    Delivery Timeline
                  </h4>
                  <div className="text-sm space-y-2 text-stone-700">
                    <div>
                      <p className="text-xs text-stone-400 font-semibold uppercase">ESTIMATED DELIVERY TIME</p>
                      <p className="font-bold text-base text-amber-700 mt-1">
                        {order.status === 'delivered' 
                          ? 'Delivered' 
                          : new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 font-semibold uppercase">ORDER PLACED TIME</p>
                      <p className="font-medium text-stone-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Right Column: Bill Details */}
          <div className="space-y-6">
            
            {/* Bill Summary */}
            <Card className="rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden bg-white">
              <div className="bg-[#FCFBF9] p-5 text-stone-900 border-b border-stone-150 flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  Bill Details
                </h3>
                <span className="text-[10px] bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase text-stone-500">
                  {order.paymentMethod}
                </span>
              </div>
              <CardContent className="p-5">
                {/* Items List */}
                <div className="space-y-3.5 mb-5 divide-y divide-stone-100">
                  {order.items.map((item: any) => (
                    <div key={item.product} className="flex justify-between items-start text-sm pt-3 first:pt-0">
                      <div className="flex gap-2">
                        {item.isVeg ? (
                          <span className="w-2 h-2 rounded-full bg-green-600 shrink-0 mt-1.5" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-red-650 shrink-0 mt-1.5" />
                        )}
                        <span className="text-stone-850 leading-snug">
                          {item.name} <span className="text-xs font-bold text-stone-400 font-mono">x{item.quantity}</span>
                        </span>
                      </div>
                      <span className="font-bold text-stone-900 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-stone-100" />

                {/* Subtotals */}
                <div className="space-y-2 text-xs py-4 border-b border-stone-100 text-stone-500">
                  <div className="flex justify-between">
                    <span className="text-stone-450">Items Subtotal</span>
                    <span className="font-semibold text-stone-800">₹{order.subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Discount</span>
                      <span>-₹{order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-stone-450">Delivery Charges</span>
                    <span className="font-semibold text-stone-800">{order.deliveryCharge > 0 ? `₹${order.deliveryCharge}` : 'FREE'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-450">GST Tax (5%)</span>
                    <span className="font-semibold text-stone-800">₹{order.tax}</span>
                  </div>
                </div>

                {/* Net amount */}
                <div className="flex justify-between items-baseline pt-4">
                  <span className="font-bold text-xs text-stone-500">Paid via {order.paymentMethod.toUpperCase()}</span>
                  <span className="text-xl font-extrabold text-amber-700">₹{order.total}</span>
                </div>
                
                <div className="text-[10px] text-stone-500 text-center mt-4 bg-stone-50 border border-stone-200 p-2.5 rounded-xl leading-snug">
                  Payment Status: <span className="font-bold text-stone-850 capitalize">{order.paymentStatus.replace('_', ' ')}</span>
                  {order.upiPaymentInfo?.transactionId && (
                    <div className="mt-1 font-mono text-[9px] text-stone-400">
                      Ref: {order.upiPaymentInfo.transactionId}
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Need Help Card */}
            <Card className="rounded-2xl border border-stone-200/80 shadow-sm text-center p-6 space-y-4 bg-white">
              <h4 className="font-bold text-sm text-stone-900">Need Help with this Order?</h4>
              <p className="text-xs text-stone-500 leading-snug">
                For corrections, cancellations, or questions, call us directly. Mention your order ID.
              </p>
              <Button asChild variant="outline" className="w-full rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50 h-10 font-bold cursor-pointer">
                <a href={`tel:${siteConfig.phone}`} className="flex items-center justify-center gap-1.5">
                  <Phone className="w-4 h-4 text-stone-500" />
                  Call {siteConfig.phone}
                </a>
              </Button>
            </Card>

          </div>

        </div>
      </div>
    </CustomerLayout>
  );
}
