'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CustomerLayout } from '@/components/layout/customer-layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/context/cart-context';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  Coffee,
  Utensils,
  ChevronRight
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface HomeClientProps {
  categories: any[];
  bestSellers: any[];
}

export function HomeClient({ categories, bestSellers }: HomeClientProps) {
  const { addToCart } = useCart();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const } },
  };

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 border-b border-stone-100">
        
        {/* Background Image - Full Cover, Crisp & Vibrant */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=1200"
            alt="Swagatam Cafe Ambiance"
            fill
            priority
            className="object-cover select-none scale-100"
          />
          {/* Subtle vignette/dimming overlay to keep the photo crisp but focus eyes on center card */}
          <div className="absolute inset-0 bg-stone-900/10" />
        </div>

        {/* Center Glass Card (Squarespace Aesthetic) */}
        <div className="container mx-auto px-4 md:px-6 z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md border border-white/30 p-8 sm:p-12 md:p-16 rounded-3xl shadow-2xl shadow-stone-900/10 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/50 border border-amber-200/30 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-6 mx-auto"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-700" />
              <span>Welcome to Swagatam Cafe Gadarwara</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-tight mb-6"
            >
              Where Every Bite<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800">
                Tells a Story
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-stone-600 text-base sm:text-lg max-w-xl mb-8 leading-relaxed mx-auto"
            >
              Indulge in our artisan coffee, sizzling pizzas, fresh burgers, and mouthwatering South Indian dosas. Fresh ingredients, served hot at Station Road or delivered directly to your doorstep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="rounded-full bg-stone-900 hover:bg-stone-850 text-white font-semibold border-0 h-14 px-8 shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                <Link href="/menu" className="flex items-center gap-2">
                  Order Online
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-stone-250 text-stone-750 hover:bg-stone-50 hover:text-stone-900 h-14 px-8 cursor-pointer">
                <Link href="#explore-menu">
                  View Menu
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 text-stone-400 animate-pulse text-xs">
          <span>Scroll to explore</span>
          <div className="w-1.5 h-6 rounded-full border border-stone-300 relative overflow-hidden">
            <motion.div 
              animate={{ y: [0, 14, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-1.5 rounded-full bg-amber-500 absolute top-1 left-0.5"
            />
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section className="bg-[#FCFBF9] border-b border-stone-200/60 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-stone-200">
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 justify-center md:justify-start pt-4 first:pt-0 md:pt-0 md:px-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">WE ARE OPEN</p>
                <p className="text-base text-stone-800 font-semibold mt-0.5">11:00 AM - 10:00 PM Daily</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 justify-center md:justify-start pt-4 md:pt-0 md:px-8">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">FIND US AT</p>
                <p className="text-base text-stone-800 font-semibold mt-0.5">Station Road, Gadarwara</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 justify-center md:justify-start pt-4 md:pt-0 md:px-8">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">RATED BY CUSTOMERS</p>
                <p className="text-base text-stone-800 font-semibold mt-0.5">4.6★ Google Local Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="explore-menu" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">Delicious Variety</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
                Browse by Category
              </h2>
            </div>
            <Link href="/menu" className="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 mt-4 md:mt-0 transition-colors">
              View Full Menu
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {categories.slice(0, 12).map((cat) => (
              <motion.div key={cat.slug} variants={itemVariants}>
                <Link 
                  href={`/menu?category=${cat.slug}`}
                  className="group block relative rounded-2xl bg-white border border-stone-200 hover:border-amber-600 p-6 text-center hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300">
                    <Utensils className="w-6 h-6 text-stone-700 group-hover:text-amber-700" />
                  </div>
                  <span className="font-semibold text-stone-900 text-sm block group-hover:text-amber-700 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Explore items
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 bg-[#FAF9F6] border-t border-stone-200/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs font-semibold text-amber-750 uppercase tracking-widest mb-2">Our Masterpieces</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
              Chef's Special Best Sellers
            </h2>
            <p className="text-sm text-stone-500 mt-3">
              The dishes that define us. Handcrafted with love and ordered daily by foodies across Gadarwara.
            </p>
          </div>          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <div 
                key={product._id} 
                className="group flex flex-col bg-white overflow-hidden transition-all duration-300"
              >
                {/* Image Container - Aspect 4:3 */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 rounded-2xl border border-stone-200/40">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                  {product.isBestSeller && (
                    <span className="absolute top-3 right-3 bg-stone-950 text-white font-semibold text-[8px] px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Content underneath - editorial alignment */}
                <div className="flex flex-col pt-4 pb-2">
                  <div className="flex items-center gap-2 mb-1 text-xs">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                      {product.category && typeof product.category === 'object' ? product.category.name : 'Swagatam Cafe'}
                    </span>
                    <span className="text-stone-300">•</span>
                    {product.isVeg ? (
                      <span className="text-[9px] font-bold text-green-600 tracking-wider uppercase">Veg</span>
                    ) : (
                      <span className="text-[9px] font-bold text-red-650 tracking-wider uppercase">Non-Veg</span>
                    )}
                  </div>

                  <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-stone-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => addToCart(product)}
                      className="rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs px-4 h-8 transition-colors cursor-pointer"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-20 bg-white border-t border-stone-200/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100/50 flex items-center justify-center text-amber-800 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-stone-900">Fast Local Delivery</h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Fast delivery across Gadarwara town directly from our kitchen. Hot, fresh, and on time.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100/50 flex items-center justify-center text-amber-800 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-stone-900">Hygiene Guaranteed</h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  We maintain strict cleanliness protocols and quality checks for every single order.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100/50 flex items-center justify-center text-amber-800 shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-stone-900">Premium Taste</h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Crafted by expert chefs using authentic recipes and the finest gourmet ingredients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Operating Hours Section */}
      <section className="py-20 bg-[#FCFBF9] border-t border-stone-200/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">Locate Us</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mb-6">
                Visit Swagatam Cafe
              </h2>
              <p className="text-stone-600 mb-8 leading-relaxed">
                Conveniently located on Station Road, right in the heart of Gadarwara. Pop in for a refreshing cold coffee, a cheesy burger, or grab a quick takeaway!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-stone-800">Our Address</h4>
                    <p className="text-sm text-stone-550 mt-1">Station Road, In Front of Comfort Hotel, Gadarwara, Madhya Pradesh, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-stone-800">Kitchen Hours</h4>
                    <p className="text-sm text-stone-550 mt-1">Everyday: 11:00 AM to 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-stone-200 shadow-md relative bg-stone-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5!2d78.7844!3d22.9247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU1JzI5LjAiTiA3OMKwNDcnMDMuOCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>

          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
