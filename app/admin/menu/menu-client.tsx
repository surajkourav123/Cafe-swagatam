'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { 
  getProductsAction, 
  getCategoriesAction, 
  createProductAction, 
  updateProductAction, 
  deleteProductAction 
} from '@/lib/actions/menu';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Coffee, 
  Leaf, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from 'next/image';

export function MenuClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [prepTime, setPrepTime] = useState('15');
  const [image, setImage] = useState('');

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        getProductsAction(),
        getCategoriesAction()
      ]);

      if (prodRes.success && prodRes.products) {
        setProducts(prodRes.products);
      }
      if (catRes.success && catRes.categories) {
        setCategories(catRes.categories);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddDialog = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setCategoryId(categories[0]?._id || '');
    setIsVeg(true);
    setIsBestSeller(false);
    setIsAvailable(true);
    setPrepTime('15');
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'); // default yummy salad fallback
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setOriginalPrice(product.originalPrice ? String(product.originalPrice) : '');
    setCategoryId(typeof product.category === 'object' ? product.category._id : product.category);
    setIsVeg(product.isVeg);
    setIsBestSeller(product.isBestSeller);
    setIsAvailable(product.isAvailable);
    setPrepTime(String(product.prepTime));
    setImage(product.image);
    setDialogOpen(true);
  };

  const handleToggleAvailable = async (product: any) => {
    const nextVal = !product.isAvailable;
    // optimistic update
    setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isAvailable: nextVal } : p));
    
    try {
      const res = await updateProductAction(product._id, { isAvailable: nextVal });
      if (res.success) {
        toast.success(`${product.name} is now ${nextVal ? 'available' : 'unavailable'}`);
      } else {
        toast.error(res.error || 'Failed to update availability');
        // revert
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isAvailable: product.isAvailable } : p));
      }
    } catch {
      toast.error('Connection error occurred');
      // revert
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isAvailable: product.isAvailable } : p));
    }
  };

  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    toast.loading('Deleting product...', { id: 'delete' });
    try {
      const res = await deleteProductAction(productId);
      if (res.success) {
        toast.success('Product deleted successfully', { id: 'delete' });
        setProducts(prev => prev.filter(p => p._id !== productId));
      } else {
        toast.error(res.error || 'Failed to delete product', { id: 'delete' });
      }
    } catch {
      toast.error('Network error deleting product', { id: 'delete' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !price || !categoryId || !image.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category: categoryId,
      isVeg,
      isBestSeller,
      isAvailable,
      prepTime: Number(prepTime),
      image,
    };

    setLoading(true);
    setDialogOpen(false);
    toast.loading(editingProduct ? 'Saving edits...' : 'Creating new product...', { id: 'submit-prod' });

    try {
      let res;
      if (editingProduct) {
        res = await updateProductAction(editingProduct._id, payload);
      } else {
        res = await createProductAction(payload);
      }

      if (res.success && res.product) {
        toast.success(editingProduct ? 'Product details updated!' : 'Product added successfully!', { id: 'submit-prod' });
        loadData();
      } else {
        toast.error(res.error || 'Operations failed', { id: 'submit-prod' });
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error occurred', { id: 'submit-prod' });
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const searchLower = search.toLowerCase();
    return p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower);
  });

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500" />
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
              placeholder="Search product directory..." 
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
            Add Menu Item
          </Button>
        </div>

        {/* Product List Cards */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed text-muted-foreground text-xs leading-normal">
            No products found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <Card 
                key={product._id} 
                className={`rounded-2xl border transition-all overflow-hidden flex flex-col ${
                  !product.isAvailable ? 'opacity-65 border-dashed bg-muted/5' : 'hover:shadow'
                }`}
              >
                {/* Image & Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.isVeg ? (
                    <span className="absolute top-3 left-3 bg-green-500/90 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                      Veg
                    </span>
                  ) : (
                    <span className="absolute top-3 left-3 bg-red-500/90 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                      Non-Veg
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-black font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Info Content */}
                <CardContent className="p-4 flex-1 flex flex-col text-xs">
                  <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mb-1.5">
                    {typeof product.category === 'object' ? product.category.name : 'Uncategorized'}
                  </span>
                  <h3 className="font-heading text-sm font-bold text-foreground truncate">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground leading-normal mt-2 line-clamp-2 flex-grow">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-muted-foreground border-b pb-3 border-border/40">
                    <span className="font-bold text-foreground text-sm">₹{product.price}</span>
                    {product.originalPrice && <span className="line-through text-[10px]">₹{product.originalPrice}</span>}
                    <span className="mx-1 text-zinc-300">|</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 shrink-0" /> {product.prepTime}m</span>
                  </div>

                  {/* Settings togglers */}
                  <div className="flex items-center justify-between pt-3 text-[11px] text-muted-foreground font-semibold">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={product.isAvailable} 
                        onCheckedChange={() => handleToggleAvailable(product)} 
                      />
                      <span>Available</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleOpenEditDialog(product)}
                        className="w-8 h-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDeleteProduct(product._id, product.name)}
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
        <DialogContent className="max-w-md rounded-2xl p-6 text-zinc-300">
          <DialogHeader>
            <DialogTitle className="font-heading text-base font-bold text-white">
              {editingProduct ? 'Edit Menu Product' : 'Add New Menu Product'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs py-2">
            
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Product Name</label>
              <Input 
                placeholder="e.g. Cheese Burst Margerita" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Item Description</label>
              <Textarea 
                placeholder="Describe flavors, toppings, portion sizes..." 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Category</label>
                <select 
                  value={categoryId}
                  required
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full flex h-10 items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id} className="bg-zinc-950 text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prep time */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Prep Time (Mins)</label>
                <Input 
                  type="number"
                  placeholder="e.g. 15" 
                  required
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Selling Price (₹)</label>
                <Input 
                  type="number"
                  placeholder="Price" 
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>

              {/* Original Price */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Original Price (₹, Optional)</label>
                <Input 
                  type="number"
                  placeholder="Strike price" 
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Product Image URL</label>
              <Input 
                placeholder="Unsplash / Cloudinary link" 
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
              />
            </div>

            {/* Veg bestseller switches */}
            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-400">
                <Switch checked={isVeg} onCheckedChange={setIsVeg} />
                <span>Veg Item</span>
              </div>

              <div className="flex items-center gap-1.5 font-semibold text-zinc-400">
                <Switch checked={isBestSeller} onCheckedChange={setIsBestSeller} />
                <span>Bestseller</span>
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-zinc-800">
              <Button 
                type="submit" 
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold h-10 border-0"
              >
                {editingProduct ? 'Save Product Changes' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
}
