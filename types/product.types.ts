export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: ICategory | string;
  price: number;
  originalPrice?: number;
  image: string;
  isVeg: boolean;
  isBestSeller: boolean;
  isAvailable: boolean;
  prepTime: number;
  sortOrder: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface MenuFilters {
  category?: string;
  search?: string;
  isVeg?: boolean;
  isBestSeller?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'popular' | 'newest';
  page?: number;
  limit?: number;
}
