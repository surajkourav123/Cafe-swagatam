import { getCategories, getProducts } from '@/lib/db-helper';
import { MenuClient } from './menu-client';

export const revalidate = 60; // Cache for 1 minute

export default async function MenuPage() {
  const categories = await getCategories();
  const products = await getProducts();

  return <MenuClient categories={categories} products={products} />;
}
