'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import { CustomerLayout } from '@/components/layout/customer-layout';
import { 
  registerAction, 
  loginAction, 
  getCurrentUserAction, 
  logoutAction 
} from '@/lib/actions/auth';
import { 
  addAddressAction, 
  getDeliveryAreasAction 
} from '@/lib/actions/checkout';
import { getMyOrdersAction } from '@/lib/actions/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  Plus, 
  ClipboardList, 
  LogOut,
  MapPinned,
  Clock,
  ExternalLink,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { ORDER_STATUSES } from '@/config/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Orders State
  const [orders, setOrders] = useState<any[]>([]);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addressName, setAddressName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressVillage, setAddressVillage] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [addressLandmark, setAddressLandmark] = useState('');
  const [deliveryAreas, setDeliveryAreas] = useState<any[]>([]);

  const loadProfile = async () => {
    try {
      const currentUser = await getCurrentUserAction();
      if (!currentUser) {
        // Redirect to login if not authenticated
        router.push('/login?from=/profile');
        return;
      }
      setUser(currentUser);
      if (currentUser && currentUser.role === 'customer') {
        const ordersRes = await getMyOrdersAction();
        if (ordersRes.success && ordersRes.orders) {
          setOrders(ordersRes.orders);
        }
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    getDeliveryAreasAction().then(res => {
      if (res.success && res.deliveryAreas) {
        setDeliveryAreas(res.deliveryAreas);
      }
    });
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressName.trim() || !addressPhone.match(/^[6-9]\d{9}$/) || !addressVillage || !addressDetail.trim()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    const res = await addAddressAction({
      label: addressLabel,
      name: addressName,
      phone: addressPhone,
      village: addressVillage,
      address: addressDetail,
      landmark: addressLandmark.trim() || undefined,
      isDefault: user?.addresses?.length === 0, // default if first
    });

    if (res.success) {
      toast.success('Address added successfully!');
      setShowAddressForm(false);
      
      // Reset form
      setAddressName('');
      setAddressPhone('');
      setAddressVillage('');
      setAddressDetail('');
      setAddressLandmark('');
      
      loadProfile();
    } else {
      toast.error(res.error || 'Failed to add address');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await logoutAction();
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  if (loading || !user) {
    return (
      <CustomerLayout>
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-stone-900 mb-4" />
            <p className="text-sm text-stone-500 font-semibold">Loading profile...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  // Logged In View
  return (
    <CustomerLayout>
      <section className="bg-[#FCFBF9] border-b border-stone-200/60 py-10 text-stone-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-stone-900 flex items-center justify-center text-2xl font-bold text-white uppercase shadow-sm">
              {user.name[0]}
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Hello, {user.name}
              </h1>
              <p className="text-sm text-stone-500 mt-1 flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-400" /> {user.phone}
              </p>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="rounded-xl border-stone-250 bg-white text-stone-750 hover:bg-stone-50 hover:text-stone-900 shadow-sm transition-all h-10 px-6 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <Tabs defaultValue="orders" className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
          
          <div className="md:w-64 shrink-0">
            <TabsList className="flex flex-row md:flex-col w-full h-auto p-1 bg-stone-50 rounded-2xl border border-stone-200 overflow-x-auto no-scrollbar shrink-0">
              <TabsTrigger value="profile" className="flex-1 md:flex-none justify-center md:justify-start gap-3 px-4 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-sm transition-all cursor-pointer whitespace-nowrap">
                <User className="w-4 h-4" />
                My Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1 md:flex-none justify-center md:justify-start gap-3 px-4 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-sm transition-all cursor-pointer whitespace-nowrap">
                <ClipboardList className="w-4 h-4" />
                Order History
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex-1 md:flex-none justify-center md:justify-start gap-3 px-4 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-sm transition-all cursor-pointer whitespace-nowrap">
                <MapPinned className="w-4 h-4" />
                Saved Addresses
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 min-w-0">
            {/* PROFILE TAB */}
            <TabsContent value="profile" className="mt-0 outline-none">
              <Card className="rounded-2xl border border-stone-200/80 bg-white shadow-sm overflow-hidden">
                <div className="bg-stone-50/50 p-6 border-b border-stone-100">
                  <h3 className="font-heading text-lg font-bold text-stone-900">Personal Information</h3>
                  <p className="text-sm text-stone-500 mt-1">Manage your basic profile details.</p>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase">Full Name</label>
                      <Input value={user.name} readOnly className="bg-stone-50/50 border-stone-200 rounded-xl text-stone-850" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase">Phone Number</label>
                      <Input value={user.phone} readOnly className="bg-stone-50/50 border-stone-200 rounded-xl text-stone-850" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase">Email Address</label>
                      <Input value={user.email || 'Not provided'} readOnly className="bg-stone-50/50 border-stone-200 rounded-xl text-stone-850" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end border-t border-stone-100">
                    <Button variant="outline" className="rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ORDERS TAB */}
            <TabsContent value="orders" className="mt-0 outline-none space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-heading text-xl font-bold text-stone-900">Order History</h2>
                <Badge variant="secondary" className="bg-stone-100 text-stone-800 rounded-full font-semibold">
                  {orders.length} Orders
                </Badge>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((ord: any) => {
                    const statusInfo = ORDER_STATUSES[ord.status as keyof typeof ORDER_STATUSES];
                    
                    return (
                      <Card key={ord._id} className="rounded-2xl border border-stone-200/80 hover:border-amber-600/35 bg-white transition-all overflow-hidden shadow-sm hover:shadow-md">
                        <div className="bg-stone-50/50 p-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">Order ID</p>
                            <p className="font-bold text-sm text-stone-900 font-mono">{ord.orderId}</p>
                          </div>
                          <div className="flex gap-6">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">Date</p>
                              <p className="font-medium text-stone-700">{new Date(ord.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">Total</p>
                              <p className="font-bold text-stone-900">₹{ord.total}</p>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-2 flex-1 min-w-0">
                            <p className="font-semibold text-stone-900 truncate">
                              {ord.items.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 w-fit px-2.5 py-1 rounded-lg">
                              <MapPin className="w-3.5 h-3.5 text-amber-700" />
                              <span className="truncate max-w-[200px]">Deliver to {ord.address.village}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                            <Badge className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                              ord.status === 'cancelled' 
                                ? 'bg-red-50 text-red-650 border border-red-200/50 hover:bg-red-50' 
                                : ord.status === 'delivered' 
                                  ? 'bg-green-50 text-green-700 border border-green-200/50 hover:bg-green-50'
                                  : 'bg-amber-50 text-amber-850 border border-amber-200/50 hover:bg-amber-50'
                            }`}>
                              {statusInfo?.label || ord.status}
                            </Badge>
                            <Button asChild size="sm" className="rounded-xl bg-stone-900 hover:bg-stone-850 text-white font-semibold cursor-pointer shadow-sm">
                              <Link href={`/order/${ord._id}`}>
                                Track Order
                                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                  <div className="w-16 h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-stone-400" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-stone-800">No orders yet</h3>
                  <p className="text-sm text-stone-500 mt-2 max-w-sm mx-auto">
                    You haven&apos;t placed any orders. Browse our menu and treat yourself to some delicious food!
                  </p>
                  <Button asChild className="mt-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold cursor-pointer">
                    <Link href="/menu">Explore Menu</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* ADDRESSES TAB */}
            <TabsContent value="addresses" className="mt-0 outline-none space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-stone-900">Saved Addresses</h2>
                <Button 
                  size="sm" 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="rounded-xl bg-white border border-stone-250 text-stone-700 hover:bg-stone-50 cursor-pointer h-9 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add New
                </Button>
              </div>

              {/* Address creation form */}
              {showAddressForm && (
                <Card className="rounded-2xl border border-stone-200 bg-stone-50/50 overflow-hidden mb-6">
                  <div className="bg-stone-100/50 px-5 py-3 border-b border-stone-200/80">
                    <h3 className="font-bold text-sm text-stone-850 flex items-center gap-2">
                      <MapPinned className="w-4 h-4 text-stone-600" />
                      Add a New Delivery Address
                    </h3>
                  </div>
                  <CardContent className="p-5 bg-white">
                    <form onSubmit={handleAddAddress} className="space-y-5">
                      {/* Label */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-500 uppercase">Save Address As</label>
                        <div className="flex flex-wrap gap-2">
                          {(['Home', 'Work', 'Other'] as const).map(lbl => (
                            <button
                              key={lbl}
                              type="button"
                              onClick={() => setAddressLabel(lbl)}
                              className={`px-4 py-2 text-xs rounded-xl border font-bold transition-all cursor-pointer ${
                                addressLabel === lbl 
                                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                                  : 'bg-white hover:bg-stone-50 text-stone-500 border-stone-200'
                              }`}
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 uppercase">Recipient Name</label>
                          <Input 
                            placeholder="e.g. John Doe"
                            required
                            value={addressName}
                            onChange={(e) => setAddressName(e.target.value)}
                            className="rounded-xl bg-stone-50/50 border-stone-200 focus-visible:ring-stone-950 text-stone-850"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 uppercase">Phone Number</label>
                          <Input 
                            placeholder="10-digit mobile number"
                            required
                            type="tel"
                            maxLength={10}
                            value={addressPhone}
                            onChange={(e) => setAddressPhone(e.target.value)}
                            className="rounded-xl bg-stone-50/50 border-stone-200 focus-visible:ring-stone-950 text-stone-850"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 uppercase">Delivery Area</label>
                          <select 
                            value={addressVillage}
                            required
                            onChange={(e) => setAddressVillage(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          >
                            <option value="">Select location in Chichli</option>
                            {deliveryAreas.map((da) => (
                              <option key={da._id} value={da.village}>
                                {da.village}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 uppercase">Landmark (Optional)</label>
                          <Input 
                            placeholder="e.g. Near Bus Stand"
                            value={addressLandmark}
                            onChange={(e) => setAddressLandmark(e.target.value)}
                            className="rounded-xl bg-stone-50/50 border-stone-200 focus-visible:ring-stone-950 text-stone-850"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500 uppercase">Complete Address</label>
                        <Input 
                          placeholder="House No, Building, Street Name"
                          required
                          value={addressDetail}
                          onChange={(e) => setAddressDetail(e.target.value)}
                          className="rounded-xl bg-stone-50/50 border-stone-200 focus-visible:ring-stone-950 text-stone-850"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => setShowAddressForm(false)}
                          className="rounded-xl h-10 px-6 font-semibold cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={loading}
                          className="rounded-xl bg-stone-900 hover:bg-stone-850 text-white font-bold h-10 px-6 shadow cursor-pointer"
                        >
                          {loading ? 'Saving...' : 'Save Address'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Addresses list */}
              {user.addresses && user.addresses.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr: any, idx: number) => (
                    <Card key={idx} className={`rounded-2xl border bg-white transition-all ${addr.isDefault ? 'border-stone-900/60 bg-stone-50/30 shadow-sm' : 'border-stone-200 hover:border-stone-300'}`}>
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg bg-stone-100 text-stone-700`}>
                              <MapPin className="w-4 h-4 animate-pulse" />
                            </div>
                            <span className="font-bold text-base text-stone-900">{addr.label}</span>
                          </div>
                          {addr.isDefault && (
                            <Badge className="bg-stone-950 text-white hover:bg-stone-900 border-0 rounded-full font-bold text-[9px] px-2 py-0.5">
                              DEFAULT
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2 text-sm mt-2 text-stone-700">
                          <p className="font-semibold text-stone-900">{addr.name} <span className="text-stone-400 font-normal">• {addr.phone}</span></p>
                          <p className="text-stone-500 leading-relaxed">
                            {addr.address}<br />
                            {addr.village}
                          </p>
                          {addr.landmark && (
                            <p className="text-xs text-stone-500 bg-stone-50 border border-stone-200/60 px-2 py-1.5 rounded-lg inline-block">
                              <span className="font-semibold text-stone-850">Landmark:</span> {addr.landmark}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                  <div className="w-16 h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto mb-4">
                    <MapPinned className="w-6 h-6 text-stone-400" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-stone-800">No saved addresses</h3>
                  <p className="text-sm text-stone-500 mt-2 max-w-sm mx-auto">
                    Save your home or work address for a faster checkout experience.
                  </p>
                  <Button 
                    onClick={() => setShowAddressForm(true)}
                    className="mt-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold cursor-pointer"
                  >
                    Add Address Now
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>

        </Tabs>
      </div>
    </CustomerLayout>
  );
}
