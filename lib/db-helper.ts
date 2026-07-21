/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import Category from '@/models/category.model';
import Product from '@/models/product.model';
import Order from '@/models/order.model';
import Coupon from '@/models/coupon.model';
import DeliveryArea from '@/models/delivery-area.model';
import User from '@/models/user.model';
import Review from '@/models/review.model';
import Admin from '@/models/admin.model';
import { MENU_CATEGORIES } from '@/config/constants';

const JSON_DB_PATH = path.join(process.cwd(), 'db.json');

// Initial seed data
const initialCategories = MENU_CATEGORIES.map((cat, idx) => ({
  name: cat,
  slug: cat.toLowerCase().replace(/\s+/g, '-'),
  sortOrder: idx,
  isActive: true,
  icon: cat.toLowerCase(),
}));

const initialProducts = [
  // Pizza
  {
    name: 'Margherita Pizza',
    description: 'Classic cheese and fresh basil tomato sauce pizza.',
    categoryName: 'Pizza',
    price: 189,
    originalPrice: 220,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 15,
  },
  {
    name: 'Double Cheese Margherita',
    description: 'Loaded with extra mozzarella cheese on a crispy crust.',
    categoryName: 'Pizza',
    price: 249,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: false,
    isAvailable: true,
    prepTime: 15,
  },
  {
    name: 'Veg Supreme Pizza',
    description: 'Topped with onions, bell peppers, olives, mushrooms, and sweet corn.',
    categoryName: 'Pizza',
    price: 319,
    originalPrice: 380,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 20,
  },
  // Burger
  {
    name: 'Veg Cheese Burger',
    description: 'Crispy veg patty, sliced cheese, lettuce, tomatoes, and chef\'s special sauce.',
    categoryName: 'Burger',
    price: 89,
    originalPrice: 110,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 10,
  },
  {
    name: 'Spicy Paneer Burger',
    description: 'Crispy paneer block dipped in spicy batter, layered with coleslaw.',
    categoryName: 'Burger',
    price: 139,
    originalPrice: 160,
    image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 12,
  },
  // Sandwich
  {
    name: 'Grilled Cheese Sandwich',
    description: 'Crispy golden brown bread with a blend of melted premium cheeses.',
    categoryName: 'Sandwich',
    price: 99,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: false,
    isAvailable: true,
    prepTime: 8,
  },
  {
    name: 'Paneer Tikka Sandwich',
    description: 'Spiced paneer tikka chunks layered with fresh greens and mint chutney.',
    categoryName: 'Sandwich',
    price: 129,
    originalPrice: 149,
    image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 10,
  },
  // Pasta
  {
    name: 'White Sauce Alfredo Pasta',
    description: 'Penne pasta tossed in rich, creamy parmesan sauce with herbs and broccoli.',
    categoryName: 'Pasta',
    price: 159,
    originalPrice: 189,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 12,
  },
  // Coffee
  {
    name: 'Hot Cappuccino',
    description: 'Rich espresso shot with steamed milk and a thick layer of foam.',
    categoryName: 'Coffee',
    price: 79,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: false,
    isAvailable: true,
    prepTime: 5,
  },
  // Cold Coffee
  {
    name: 'Classic Cold Coffee',
    description: 'Chilled milk blended with espresso and sugar, served with a frothy top.',
    categoryName: 'Cold Coffee',
    price: 99,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 5,
  },
  {
    name: 'Cold Coffee with Ice Cream',
    description: 'Our classic cold coffee topped with a rich scoop of vanilla ice cream.',
    categoryName: 'Cold Coffee',
    price: 129,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 5,
  },
  // Milkshake
  {
    name: 'Oreo Milkshake',
    description: 'Thick shake blended with Oreo cookies, milk, and chocolate syrup.',
    categoryName: 'Milkshake',
    price: 119,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 6,
  },
  // Roll
  {
    name: 'Paneer Kathi Roll',
    description: 'Spiced paneer filling with peppers, onions, and sauces wrapped in a paratha.',
    categoryName: 'Roll',
    price: 109,
    image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 10,
  },
  // Pav Bhaji
  {
    name: 'Special Butter Pav Bhaji',
    description: 'Thick, spicy vegetable curry cooked in butter, served with soft buttered pav.',
    categoryName: 'Pav Bhaji',
    price: 99,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 8,
  },
  // Dosa
  {
    name: 'Masala Dosa',
    description: 'Crispy crepe filled with potato masala, served with sambar and coconut chutney.',
    categoryName: 'Dosa',
    price: 109,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 12,
  },
  // Snacks
  {
    name: 'Peri Peri French Fries',
    description: 'Crispy fries tossed in spicy peri peri seasoning.',
    categoryName: 'Snacks',
    price: 79,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: false,
    isAvailable: true,
    prepTime: 7,
  },
  // Dessert
  {
    name: 'Sizzling Brownie with Ice Cream',
    description: 'Hot chocolate brownie on a sizzler plate, topped with cold vanilla ice cream and hot fudge.',
    categoryName: 'Dessert',
    price: 149,
    originalPrice: 179,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isBestSeller: true,
    isAvailable: true,
    prepTime: 8,
  },
];

const initialDeliveryAreas = [
  { village: 'Station Road', pincode: '487551', deliveryCharge: 0, estimatedTime: 15, isActive: true },
  { village: 'Bus Stand Area', pincode: '487551', deliveryCharge: 15, estimatedTime: 20, isActive: true },
  { village: 'Khurpa Mandi', pincode: '487551', deliveryCharge: 20, estimatedTime: 25, isActive: true },
  { village: 'Patel Ward', pincode: '487551', deliveryCharge: 20, estimatedTime: 25, isActive: true },
  { village: 'Civil Lines', pincode: '487551', deliveryCharge: 25, estimatedTime: 30, isActive: true },
];

const initialCoupons = [
  { code: 'SWAGATAM', type: 'percentage' as const, value: 15, minOrder: 199, maxDiscount: 100, validFrom: new Date().toISOString(), validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), isActive: true },
  { code: 'WELCOME50', type: 'flat' as const, value: 50, minOrder: 299, validFrom: new Date().toISOString(), validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), isActive: true },
];

// File db fallback store definition
interface FileDatabase {
  categories: any[];
  products: any[];
  orders: any[];
  coupons: any[];
  deliveryAreas: any[];
  users: any[];
  reviews: any[];
  settings: any;
}

function loadFileDB(): FileDatabase {
  if (!fs.existsSync(JSON_DB_PATH)) {
    // Generate initial db
    const catWithIds = initialCategories.map((c, i) => ({ ...c, _id: `cat_${i + 1}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
    
    const prodWithIds = initialProducts.map((p, i) => {
      const category = catWithIds.find(c => c.name === p.categoryName);
      return {
        _id: `prod_${i + 1}`,
        name: p.name,
        slug: p.name.toLowerCase().replace(/\s+/g, '-'),
        description: p.description,
        category: category?._id || `cat_1`,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        isVeg: p.isVeg,
        isBestSeller: p.isBestSeller,
        isAvailable: p.isAvailable,
        prepTime: p.prepTime,
        sortOrder: i,
        averageRating: 4.8,
        reviewCount: 15 + (i * 3),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    const db: FileDatabase = {
      categories: catWithIds,
      products: prodWithIds,
      orders: [],
      coupons: initialCoupons.map((c, i) => ({ ...c, _id: `coupon_${i + 1}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
      deliveryAreas: initialDeliveryAreas.map((da, i) => ({ ...da, _id: `da_${i + 1}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
      users: [],
      reviews: [],
      settings: {
        minOrderAmount: 0,
        taxRate: 5,
        operatingHours: { open: '11:00', close: '22:00', days: 'Monday to Sunday' },
        phone: '+91 91746 50575',
        email: 'swagatamcafeofficial@gmail.com',
        address: 'Station Road, Chichli, Madhya Pradesh',
      }
    };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
    return db;
  }

  try {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If corrupt, recreate
    fs.unlinkSync(JSON_DB_PATH);
    return loadFileDB();
  }
}

function saveFileDB(db: FileDatabase) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

export async function seedDefaultAdmin() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = process.env.ADMIN_EMAIL || 'admin@swagatamcafe.com';
      const password = process.env.ADMIN_PASSWORD || 'adminpassword';
      const hashedPassword = await bcrypt.hash(password, 12);
      
      await Admin.create({
        name: 'Swagatam Admin',
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'superadmin',
      });
      console.log('Seeded default admin in MongoDB');
    }
  } catch (error: any) {
    console.error('Error seeding default admin:', error.message);
  }
}

export async function checkDBConnected(): Promise<boolean> {
  const isMDBAvailable = !!process.env.MONGODB_URI && 
                         !process.env.MONGODB_URI.includes('<user>') && 
                         !process.env.MONGODB_URI.includes('placeholder');
  
  try {
    const conn = await connectDB();
    if (conn.connection.readyState === 1) {
      // Seed default admin in background
      seedDefaultAdmin();
      return true;
    }
    if (isMDBAvailable) {
      throw new Error("MongoDB connection readyState is not 1");
    }
    return false;
  } catch (error) {
    if (isMDBAvailable) {
      throw error;
    }
    return false;
  }
}

// Wrapper utility for generic database actions
export async function getCategories() {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    let list = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    if (list.length === 0) {
      // Seed categories in MongoDB
      await Category.insertMany(initialCategories);
      list = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    }
    return JSON.parse(JSON.stringify(list));
  } else {
    const db = loadFileDB();
    return db.categories.filter(c => c.isActive);
  }
}

export async function getProducts(filters: { categorySlug?: string; search?: string; isVeg?: boolean; limit?: number } = {}) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    // Make sure we have seeded products if empty
    const count = await Product.countDocuments();
    if (count === 0) {
      const cats = await Category.find();
      if (cats.length === 0) {
        await Category.insertMany(initialCategories);
      }
      const allCats = await Category.find();
      const productsToInsert = initialProducts.map(p => {
        const cat = allCats.find(c => c.name === p.categoryName);
        return {
          ...p,
          slug: p.name.toLowerCase().replace(/\s+/g, '-'),
          category: cat?._id || allCats[0]._id,
          sortOrder: 0,
        };
      });
      await Product.insertMany(productsToInsert);
    }

    const query: any = { isAvailable: true };
    if (filters.isVeg !== undefined) {
      query.isVeg = filters.isVeg;
    }
    if (filters.categorySlug) {
      const cat = await Category.findOne({ slug: filters.categorySlug });
      if (cat) query.category = cat._id;
    }
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    let q = Product.find(query).populate('category').sort({ sortOrder: 1 });
    if (filters.limit) {
      q = q.limit(filters.limit);
    }
    const list = await q;
    return JSON.parse(JSON.stringify(list));
  } else {
    const db = loadFileDB();
    let list = db.products.filter(p => p.isAvailable);

    if (filters.isVeg !== undefined) {
      list = list.filter(p => p.isVeg === filters.isVeg);
    }
    if (filters.categorySlug) {
      const cat = db.categories.find(c => c.slug === filters.categorySlug);
      if (cat) {
        list = list.filter(p => p.category === cat._id);
      } else {
        list = [];
      }
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower));
    }
    
    // populate category
    const populated = list.map(p => {
      const cat = db.categories.find(c => c._id === p.category);
      return {
        ...p,
        category: cat || { name: 'Unknown', slug: 'unknown' }
      };
    });

    if (filters.limit) {
      return populated.slice(0, filters.limit);
    }
    return populated;
  }
}

export async function getProductBySlug(slug: string) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const product = await Product.findOne({ slug }).populate('category');
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } else {
    const db = loadFileDB();
    const product = db.products.find(p => p.slug === slug);
    if (!product) return null;
    const cat = db.categories.find(c => c._id === product.category);
    return {
      ...product,
      category: cat || { name: 'Unknown', slug: 'unknown' }
    };
  }
}

export async function getDeliveryAreas() {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    let list = await DeliveryArea.find({ isActive: true });
    if (list.length === 0) {
      await DeliveryArea.insertMany(initialDeliveryAreas);
      list = await DeliveryArea.find({ isActive: true });
    }
    return JSON.parse(JSON.stringify(list));
  } else {
    const db = loadFileDB();
    return db.deliveryAreas.filter(da => da.isActive);
  }
}

export async function getCouponByCode(code: string) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    // Seed coupons if empty
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany(initialCoupons);
    }
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    return coupon ? JSON.parse(JSON.stringify(coupon)) : null;
  } else {
    const db = loadFileDB();
    const coupon = db.coupons.find(c => c.code === code.toUpperCase() && c.isActive);
    return coupon || null;
  }
}

// User-related DB helpers
export async function dbGetUserByPhone(phone: string) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const user = await User.findOne({ phone });
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } else {
    const db = loadFileDB();
    const user = db.users.find(u => u.phone === phone);
    return user || null;
  }
}

export async function dbGetUserById(id: string) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const user = await User.findById(id);
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } else {
    const db = loadFileDB();
    const user = db.users.find(u => u._id === id);
    return user || null;
  }
}

export async function dbCreateUser(userData: any) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const user = new User({
      ...userData,
      role: 'customer',
      isActive: true,
      favorites: [],
      addresses: []
    });
    await user.save();
    return JSON.parse(JSON.stringify(user));
  } else {
    const db = loadFileDB();
    const newUser = {
      _id: `user_${Date.now()}`,
      ...userData,
      role: 'customer',
      favorites: [],
      addresses: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveFileDB(db);
    return newUser;
  }
}

export async function dbAddAddress(userId: string, address: any) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    const newAddress = {
      ...address,
      _id: new mongoose.Types.ObjectId(),
    };
    
    if (address.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    } else if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }
    
    user.addresses.push(newAddress);
    await user.save();
    return JSON.parse(JSON.stringify(user));
  } else {
    const db = loadFileDB();
    const userIdx = db.users.findIndex(u => u._id === userId);
    if (userIdx === -1) throw new Error('User not found');
    
    const user = db.users[userIdx];
    const newAddress = {
      _id: `addr_${Date.now()}`,
      ...address,
    };
    
    if (address.isDefault) {
      user.addresses.forEach((addr: any) => addr.isDefault = false);
    } else if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }
    
    user.addresses.push(newAddress);
    db.users[userIdx] = user;
    saveFileDB(db);
    return user;
  }
}

// Order-related DB helpers
export async function dbCreateOrder(orderData: any) {
  const isConnected = await checkDBConnected();
  const orderId = 'SW-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();
  
  const statusHistory = [
    { status: 'pending', timestamp: now, note: 'Order placed successfully' }
  ];

  if (isConnected) {
    const order = new Order({
      ...orderData,
      orderId,
      status: 'pending',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'verification_pending',
      statusHistory
    });
    await order.save();
    return JSON.parse(JSON.stringify(order));
  } else {
    const db = loadFileDB();
    const newOrder = {
      _id: `order_${Date.now()}`,
      ...orderData,
      orderId,
      status: 'pending',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'verification_pending',
      statusHistory,
      createdAt: now,
      updatedAt: now
    };
    db.orders.push(newOrder);
    saveFileDB(db);
    return newOrder;
  }
}

export async function dbGetOrders(userId: string) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(orders));
  } else {
    const db = loadFileDB();
    return db.orders.filter(o => o.user === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function dbGetOrderById(id: string) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const order = await Order.findById(id);
    return order ? JSON.parse(JSON.stringify(order)) : null;
  } else {
    const db = loadFileDB();
    const order = db.orders.find(o => o._id === id || o.orderId === id);
    return order || null;
  }
}

// Admin API wrappers
export async function dbGetAllOrders() {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const orders = await Order.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(orders));
  } else {
    const db = loadFileDB();
    return db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function dbUpdateOrderStatus(orderId: string, status: string, note?: string) {
  const isConnected = await checkDBConnected();
  const now = new Date().toISOString();
  
  if (isConnected) {
    const order = await Order.findById(orderId);
    if (!order) return null;
    order.status = status as any;
    if (status === 'delivered' || (status === 'confirmed' && order.paymentMethod === 'upi')) {
      order.paymentStatus = 'paid';
    }
    order.statusHistory.push({ status: status as any, timestamp: new Date(), note });
    await order.save();
    return JSON.parse(JSON.stringify(order));
  } else {
    const db = loadFileDB();
    const idx = db.orders.findIndex(o => o._id === orderId);
    if (idx === -1) return null;
    
    db.orders[idx].status = status;
    if (status === 'delivered' || (status === 'confirmed' && db.orders[idx].paymentMethod === 'upi')) {
      db.orders[idx].paymentStatus = 'paid';
    }
    db.orders[idx].statusHistory.push({ status, timestamp: now, note });
    db.orders[idx].updatedAt = now;
    
    saveFileDB(db);
    return db.orders[idx];
  }
}

export async function dbGetAllProducts() {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const products = await Product.find().populate('category').sort({ sortOrder: 1 });
    return JSON.parse(JSON.stringify(products));
  } else {
    const db = loadFileDB();
    return db.products.map(p => {
      const cat = db.categories.find(c => c._id === p.category);
      return {
        ...p,
        category: cat || { name: 'Unknown', slug: 'unknown' }
      };
    });
  }
}

export async function dbCreateProduct(productData: any) {
  const isConnected = await checkDBConnected();
  const slug = productData.name.toLowerCase().replace(/\s+/g, '-');
  if (isConnected) {
    const product = new Product({
      ...productData,
      slug,
      averageRating: 4.5,
      reviewCount: 1,
    });
    await product.save();
    return JSON.parse(JSON.stringify(product));
  } else {
    const db = loadFileDB();
    const newProduct = {
      _id: `prod_${Date.now()}`,
      ...productData,
      slug,
      averageRating: 4.5,
      reviewCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    saveFileDB(db);
    return newProduct;
  }
}

export async function dbUpdateProduct(id: string, productData: any) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } else {
    const db = loadFileDB();
    const idx = db.products.findIndex(p => p._id === id);
    if (idx === -1) return null;
    db.products[idx] = {
      ...db.products[idx],
      ...productData,
      updatedAt: new Date().toISOString()
    };
    saveFileDB(db);
    return db.products[idx];
  }
}

export async function dbDeleteProduct(id: string) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    await Product.findByIdAndDelete(id);
    return true;
  } else {
    const db = loadFileDB();
    db.products = db.products.filter(p => p._id !== id);
    saveFileDB(db);
    return true;
  }
}

export async function dbGetAllCategories() {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const list = await Category.find().sort({ sortOrder: 1 });
    return JSON.parse(JSON.stringify(list));
  } else {
    const db = loadFileDB();
    return db.categories;
  }
}

export async function dbCreateCategory(categoryData: any) {
  const isConnected = await checkDBConnected();
  const slug = categoryData.name.toLowerCase().replace(/\s+/g, '-');
  if (isConnected) {
    const category = new Category({
      ...categoryData,
      slug,
      isActive: true,
    });
    await category.save();
    return JSON.parse(JSON.stringify(category));
  } else {
    const db = loadFileDB();
    const newCategory = {
      _id: `cat_${Date.now()}`,
      ...categoryData,
      slug,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.categories.push(newCategory);
    saveFileDB(db);
    return newCategory;
  }
}

export async function dbUpdateCategory(id: string, categoryData: any) {
  const isConnected = await checkDBConnected();
  const slug = categoryData.name ? categoryData.name.toLowerCase().replace(/\s+/g, '-') : undefined;
  const updateData = slug ? { ...categoryData, slug } : categoryData;
  if (isConnected) {
    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    return category ? JSON.parse(JSON.stringify(category)) : null;
  } else {
    const db = loadFileDB();
    const idx = db.categories.findIndex(c => c._id === id);
    if (idx === -1) return null;
    db.categories[idx] = {
      ...db.categories[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    saveFileDB(db);
    return db.categories[idx];
  }
}

export async function dbDeleteCategory(id: string) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    await Category.findByIdAndDelete(id);
    return true;
  } else {
    const db = loadFileDB();
    db.categories = db.categories.filter(c => c._id !== id);
    saveFileDB(db);
    return true;
  }
}

export async function dbGetAllDeliveryAreas() {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const list = await DeliveryArea.find();
    return JSON.parse(JSON.stringify(list));
  } else {
    const db = loadFileDB();
    return db.deliveryAreas;
  }
}

export async function dbCreateDeliveryArea(areaData: any) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const area = new DeliveryArea({
      ...areaData,
      isActive: true,
    });
    await area.save();
    return JSON.parse(JSON.stringify(area));
  } else {
    const db = loadFileDB();
    const newArea = {
      _id: `da_${Date.now()}`,
      ...areaData,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.deliveryAreas.push(newArea);
    saveFileDB(db);
    return newArea;
  }
}

export async function dbUpdateDeliveryArea(id: string, areaData: any) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const area = await DeliveryArea.findByIdAndUpdate(id, areaData, { new: true });
    return area ? JSON.parse(JSON.stringify(area)) : null;
  } else {
    const db = loadFileDB();
    const idx = db.deliveryAreas.findIndex(da => da._id === id);
    if (idx === -1) return null;
    db.deliveryAreas[idx] = {
      ...db.deliveryAreas[idx],
      ...areaData,
      updatedAt: new Date().toISOString()
    };
    saveFileDB(db);
    return db.deliveryAreas[idx];
  }
}

export async function dbDeleteDeliveryArea(id: string) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    await DeliveryArea.findByIdAndDelete(id);
    return true;
  } else {
    const db = loadFileDB();
    db.deliveryAreas = db.deliveryAreas.filter(da => da._id !== id);
    saveFileDB(db);
    return true;
  }
}

export async function dbGetAllCoupons() {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    const list = await Coupon.find();
    return JSON.parse(JSON.stringify(list));
  } else {
    const db = loadFileDB();
    return db.coupons;
  }
}

export async function dbCreateCoupon(couponData: any) {
  const isConnected = await checkDBConnected();
  const code = couponData.code.toUpperCase();
  if (isConnected) {
    const coupon = new Coupon({
      ...couponData,
      code,
      isActive: true,
    });
    await coupon.save();
    return JSON.parse(JSON.stringify(coupon));
  } else {
    const db = loadFileDB();
    const newCoupon = {
      _id: `cp_${Date.now()}`,
      ...couponData,
      code,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.coupons.push(newCoupon);
    saveFileDB(db);
    return newCoupon;
  }
}

export async function dbUpdateCoupon(id: string, couponData: any) {
  const isConnected = await checkDBConnected();
  const code = couponData.code ? couponData.code.toUpperCase() : undefined;
  const updateData = code ? { ...couponData, code } : couponData;
  if (isConnected) {
    const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
    return coupon ? JSON.parse(JSON.stringify(coupon)) : null;
  } else {
    const db = loadFileDB();
    const idx = db.coupons.findIndex(c => c._id === id);
    if (idx === -1) return null;
    db.coupons[idx] = {
      ...db.coupons[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    saveFileDB(db);
    return db.coupons[idx];
  }
}

export async function dbDeleteCoupon(id: string) {
  const isConnected = await checkDBConnected();
  if (isConnected) {
    await Coupon.findByIdAndDelete(id);
    return true;
  } else {
    const db = loadFileDB();
    db.coupons = db.coupons.filter(c => c._id !== id);
    saveFileDB(db);
    return true;
  }
}
