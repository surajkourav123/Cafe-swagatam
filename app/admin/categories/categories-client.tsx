'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { 
  getAllCategoriesAction, 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction 
} from '@/lib/actions/menu';
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
  FolderHeart,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function CategoriesClient() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [icon, setIcon] = useState('coffee');

  const loadCategories = async () => {
    try {
      const res = await getAllCategoriesAction();
      if (res.success && res.categories) {
        setCategories(res.categories);
      } else {
        toast.error(res.error || 'Failed to load categories');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAddDialog = () => {
    setEditingCategory(null);
    setName('');
    setSortOrder(String(categories.length));
    setIsActive(true);
    setIcon('coffee');
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSortOrder(String(cat.sortOrder));
    setIsActive(cat.isActive);
    setIcon(cat.icon || 'coffee');
    setDialogOpen(true);
  };

  const handleToggleActive = async (cat: any) => {
    const nextVal = !cat.isActive;
    setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, isActive: nextVal } : c));
    
    try {
      const res = await updateCategoryAction(cat._id, { isActive: nextVal });
      if (res.success) {
        toast.success(`Category "${cat.name}" is now ${nextVal ? 'active' : 'inactive'}`);
      } else {
        toast.error(res.error || 'Failed to update category');
        setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, isActive: cat.isActive } : c));
      }
    } catch {
      toast.error('Network error occurred');
      setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, isActive: cat.isActive } : c));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete category "${name}"?`)) return;

    toast.loading('Deleting category...', { id: 'delete' });
    try {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        toast.success('Category deleted successfully', { id: 'delete' });
        setCategories(prev => prev.filter(c => c._id !== id));
      } else {
        toast.error(res.error || 'Failed to delete category', { id: 'delete' });
      }
    } catch {
      toast.error('Network error deleting category', { id: 'delete' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    const payload = {
      name: name.trim(),
      sortOrder: Number(sortOrder),
      isActive,
      icon: icon.trim(),
    };

    setLoading(true);
    setDialogOpen(false);
    toast.loading(editingCategory ? 'Saving category...' : 'Creating category...', { id: 'submit-cat' });

    try {
      let res;
      if (editingCategory) {
        res = await updateCategoryAction(editingCategory._id, payload);
      } else {
        res = await createCategoryAction(payload);
      }

      if (res.success) {
        toast.success(editingCategory ? 'Category updated!' : 'Category created!', { id: 'submit-cat' });
        loadCategories();
      } else {
        toast.error(res.error || 'Operation failed', { id: 'submit-cat' });
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error occurred', { id: 'submit-cat' });
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && categories.length === 0) {
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
              placeholder="Search categories..." 
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
            Add Category
          </Button>
        </div>

        {/* Categories list */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed text-muted-foreground text-xs leading-normal">
            No categories found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((cat) => (
              <Card 
                key={cat._id} 
                className={`rounded-2xl border transition-all overflow-hidden flex flex-col ${
                  !cat.isActive ? 'opacity-65 border-dashed bg-muted/5' : 'hover:shadow'
                }`}
              >
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <FolderHeart className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-foreground">
                          {cat.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          slug: {cat.slug}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-semibold text-[10px] rounded-lg">
                      Order: {cat.sortOrder}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground font-semibold">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={cat.isActive} 
                        onCheckedChange={() => handleToggleActive(cat)} 
                      />
                      <span>Active</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleOpenEditDialog(cat)}
                        className="w-8 h-8 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(cat._id, cat.name)}
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
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs py-2">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Category Name</label>
              <Input 
                placeholder="e.g. South Indian" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Sort Order */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Sort Order</label>
                <Input 
                  type="number"
                  placeholder="e.g. 5" 
                  required
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>

              {/* Icon name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Icon Key</label>
                <Input 
                  placeholder="e.g. coffee" 
                  required
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="rounded-xl border-zinc-800 bg-zinc-950 focus-visible:ring-amber-500 text-white"
                />
              </div>
            </div>

            {/* Active switch */}
            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              <span className="font-semibold text-zinc-400">Category Active Status</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <DialogFooter className="pt-2 border-t border-zinc-800">
              <Button 
                type="submit" 
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold h-10 border-0"
              >
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
