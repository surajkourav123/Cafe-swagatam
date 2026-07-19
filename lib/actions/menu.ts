'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { 
  getCategories, 
  getProducts, 
  getProductBySlug,
  dbGetAllCategories,
  dbCreateCategory,
  dbUpdateCategory,
  dbDeleteCategory
} from '@/lib/db-helper';

export async function getCategoriesAction() {
  try {
    const categories = await getCategories();
    return { success: true, categories };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to load categories' };
  }
}

export async function getAllCategoriesAction() {
  try {
    const categories = await dbGetAllCategories();
    return { success: true, categories };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to load categories' };
  }
}

export async function createCategoryAction(categoryData: any) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const newCategory = await dbCreateCategory(categoryData);
    return { success: true, category: newCategory };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create category' };
  }
}

export async function updateCategoryAction(id: string, categoryData: any) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const updatedCategory = await dbUpdateCategory(id, categoryData);
    return { success: true, category: updatedCategory };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update category' };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    await dbDeleteCategory(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete category' };
  }
}

export async function getProductsAction(filters: { categorySlug?: string; search?: string; isVeg?: boolean; limit?: number } = {}) {
  try {
    const products = await getProducts(filters);
    return { success: true, products };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to load products' };
  }
}

export async function getProductBySlugAction(slug: string) {
  try {
    const product = await getProductBySlug(slug);
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to load product' };
  }
}

// Admin menu management actions
import { dbCreateProduct, dbUpdateProduct, dbDeleteProduct } from '@/lib/db-helper';
import { getCurrentUserAction } from './auth';

export async function createProductAction(productData: any) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const newProduct = await dbCreateProduct(productData);
    return { success: true, product: newProduct };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create product' };
  }
}

export async function updateProductAction(id: string, productData: any) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const updatedProduct = await dbUpdateProduct(id, productData);
    return { success: true, product: updatedProduct };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    await dbDeleteProduct(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

