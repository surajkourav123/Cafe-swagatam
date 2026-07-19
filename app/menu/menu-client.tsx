'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/customer-layout';
import { useCart } from '@/lib/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Clock, 
  Star, 
  ShoppingCart, 
  SlidersHorizontal,
  Flame,
  Leaf
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuClientProps {
  categories: any[];
  products: any[];
}

export function MenuClient({ categories, products }: MenuClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart, items } = useCart();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // Sync state from query parameters on mount/url change
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('all');
    }

    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParams]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/menu?${params.toString()}`, { scroll: false });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => {
        const catSlug = typeof p.category === 'object' ? p.category.slug : p.category;
        return catSlug === selectedCategory;
      });
    }

    // Filter by search query
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // Filter by veg-only
    if (isVegOnly) {
      result = result.filter(p => p.isVeg);
    }

    // Sort products
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return result;
  }, [products, selectedCategory, search, isVegOnly, sortBy]);

  return (
    <CustomerLayout>
      <section className="bg-[#FCFBF9] border-b border-stone-200/60 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-3">
              Explore Our Menu
            </h1>
            <p className="text-stone-500 text-sm sm:text-base">
              Delicious recipes cooked with love. Browse our range of pizzas, cold shakes, coffee, dosas, and rolls.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="sticky top-[73px] z-20 bg-white/95 backdrop-blur border-b border-stone-200/60 py-4 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input 
              type="search" 
              placeholder="Search dishes (e.g. pizza, sandwich)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full border-stone-200 bg-stone-50/50 focus-visible:ring-stone-950 h-11"
            />
          </div>

          {/* Filters (Veg/NonVeg toggle, Sort dropdown) */}
          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-6">
            {/* Veg Switch */}
            <div className="flex items-center space-x-2">
              <Leaf className={`w-4 h-4 ${isVegOnly ? 'text-green-600' : 'text-stone-400'}`} />
              <Label htmlFor="veg-only" className="text-sm font-semibold text-stone-700 cursor-pointer">Veg Only</Label>
              <Switch 
                id="veg-only" 
                checked={isVegOnly}
                onCheckedChange={setIsVegOnly}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-stone-400" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm font-semibold bg-transparent border-0 border-b border-transparent focus:ring-0 focus:border-stone-900 py-1 pr-8 cursor-pointer text-stone-800"
              >
                <option value="popular" className="bg-white">Most Popular</option>
                <option value="price_asc" className="bg-white">Price: Low to High</option>
                <option value="price_desc" className="bg-white">Price: High to Low</option>
                <option value="name_asc" className="bg-white">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main menu content */}
      <div className="container mx-auto px-4 md:px-6 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Category list (Vertical on desktop) */}
        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-[160px] lg:h-[calc(100vh-200px)] lg:overflow-y-auto pr-2 pb-4 scrollbar-thin">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-1.5 lg:space-y-1 select-none no-scrollbar">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'ghost'}
              onClick={() => handleCategoryChange('all')}
              className={`rounded-full lg:rounded-xl justify-start h-11 shrink-0 cursor-pointer ${
                selectedCategory === 'all' 
                  ? 'bg-stone-900 hover:bg-stone-800 text-white font-semibold shadow' 
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              All Categories
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.slug}
                variant={selectedCategory === cat.slug ? 'default' : 'ghost'}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`rounded-full lg:rounded-xl justify-start h-11 shrink-0 cursor-pointer ${
                  selectedCategory === cat.slug 
                    ? 'bg-stone-900 hover:bg-stone-800 text-white font-semibold shadow' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </aside>

        {/* Right Side: Product grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-semibold text-stone-400">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'dish' : 'dishes'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
              <Flame className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <h3 className="font-heading text-lg font-bold text-stone-800">No dishes found</h3>
              <p className="text-sm text-stone-500 mt-2 max-w-xs mx-auto">
                We couldn't find any items matching your filters. Try clearing some selections.
              </p>
              <Button 
                variant="outline" 
                onClick={() => { setSearch(''); handleCategoryChange('all'); setIsVegOnly(false); }}
                className="mt-6 rounded-xl border-stone-300 hover:bg-stone-50 cursor-pointer"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
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

                    {/* Content underneath */}
                    <div className="flex flex-col pt-4 pb-2">
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                          {product.category && typeof product.category === 'object' ? product.category.name : 'Cafe'}
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
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

      {/* Floating cart summary bar on mobile */}
      {items.length > 0 && (
        <div className="md:hidden fixed bottom-20 left-4 right-4 z-30">
          <Button asChild className="w-full rounded-2xl bg-stone-950 hover:bg-stone-900 text-white font-bold h-12 shadow-xl border-0 flex justify-between px-6 cursor-pointer">
            <Link href="/cart">
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-white" />
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)} Items</span>
              </span>
              <span>View Cart</span>
            </Link>
          </Button>
        </div>
      )}
    </CustomerLayout>
  );
}
