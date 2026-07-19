/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCategories, getProducts } from '@/lib/db-helper';
import { HomeClient } from './home-client';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  // Fetch categories and best seller products
  const categories = await getCategories();
  
  // Fetch best sellers: can filter products where isBestSeller is true
  const allProducts = await getProducts();
  const bestSellers = allProducts
    .filter((p: any) => p.isBestSeller && p.isAvailable)
    .slice(0, 4);

  return <HomeClient categories={categories} bestSellers={bestSellers} />;
}
