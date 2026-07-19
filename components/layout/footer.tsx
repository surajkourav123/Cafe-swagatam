'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site.config';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  UtensilsCrossed 
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F9F8F6] text-stone-600 border-t border-stone-200/80 mt-auto">
      {/* Top section: Grid */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2 group mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <Image src="/images/logo.png" alt="Swagatam Cafe Logo" width={40} height={40} className="object-contain" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-stone-550 leading-relaxed">
              {siteConfig.tagline}. Order premium food, shakes, pizzas, and cafe items online for quick home delivery.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <Link href={siteConfig.social.instagram} className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors text-xs font-bold">
                IG
              </Link>
              <Link href={siteConfig.social.facebook} className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors text-xs font-bold">
                FB
              </Link>
              <Link href={siteConfig.social.twitter} className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors text-xs font-bold">
                X
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-stone-800">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-700 transition-colors text-stone-600">Home</Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-700 transition-colors text-stone-600">Explore Menu</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-amber-700 transition-colors text-stone-600">Your Cart</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-amber-700 transition-colors text-stone-600">My Profile</Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="text-stone-400 hover:text-amber-700 transition-colors">Staff Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col space-y-4 md:col-span-2">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-stone-800">
              Contact & Hours
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4.5 h-4.5 text-amber-700 shrink-0 mt-0.5" />
                  <span className="text-stone-550">
                    Station Road, Gadarwara,<br />
                    Madhya Pradesh, 487551
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4.5 h-4.5 text-amber-700 shrink-0" />
                  <a href={`tel:${siteConfig.phone}`} className="text-stone-550 hover:text-amber-700 transition-colors">
                    +91 91794 88390
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4.5 h-4.5 text-amber-700 shrink-0" />
                  <a href={`mailto:${siteConfig.email}`} className="text-stone-550 hover:text-amber-700 transition-colors">
                    {siteConfig.email}
                  </a>
                </div>
              </div>
              
              <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span className="font-semibold text-stone-850">Operating Hours</span>
                </div>
                <p className="text-stone-550 text-xs">
                  Open Everyday:<br />
                  <span className="text-amber-700 font-medium">11:00 AM - 10:00 PM</span>
                </p>
                <p className="text-stone-400 text-[11px] leading-tight">
                  Delivery available within Gadarwara city areas. Minimum order ₹0.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Google Maps embed and copyright */}
        <div className="border-t border-stone-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-450">
            &copy; {currentYear} Swagatam Cafe. All rights reserved. Made with ❤️ in Gadarwara.
          </p>
          <div className="text-xs text-stone-450 flex items-center space-x-4">
            <Link href="#" className="hover:text-stone-900 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-stone-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
