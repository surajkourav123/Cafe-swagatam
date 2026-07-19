import { Home, UtensilsCrossed, ShoppingCart, User, Search, MapPin, Heart, Clock, Settings, LayoutDashboard, Package, Truck, Tag, Users, Star, Image, BarChart3, Bell } from 'lucide-react';

export const customerNav = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Menu', href: '/menu', icon: UtensilsCrossed },
  { label: 'Cart', href: '/cart', icon: ShoppingCart },
  { label: 'Orders', href: '/order', icon: Clock },
  { label: 'Profile', href: '/profile', icon: User },
] as const;

export const customerMobileNav = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Menu', href: '/menu', icon: UtensilsCrossed },
  { label: 'Search', href: '/menu?focus=search', icon: Search },
  { label: 'Cart', href: '/cart', icon: ShoppingCart },
  { label: 'Profile', href: '/profile', icon: User },
] as const;

export const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Menu', href: '/admin/menu', icon: UtensilsCrossed },
  { label: 'Categories', href: '/admin/categories', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Delivery', href: '/admin/delivery', icon: Truck },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
] as const;
