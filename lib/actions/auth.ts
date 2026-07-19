'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { cookies } from 'next/headers';
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken, 
  getTokenCookieOptions 
} from '@/lib/auth';
import { 
  dbGetUserByPhone, 
  dbCreateUser, 
  dbGetUserById 
} from '@/lib/db-helper';
import type { LoginFormData, RegisterFormData, AdminLoginFormData } from '@/lib/validations';

const COOKIE_NAME = 'swagatam-auth-token';

export async function registerAction(data: RegisterFormData) {
  try {
    const existingUser = await dbGetUserByPhone(data.phone);
    if (existingUser) {
      return { success: false, error: 'Phone number already registered' };
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await dbCreateUser({
      name: data.name,
      phone: data.phone,
      password: hashedPassword,
      email: data.email,
    });

    const token = generateToken({
      userId: user._id,
      role: 'customer',
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, getTokenCookieOptions());

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Registration failed' };
  }
}

export async function loginAction(data: LoginFormData) {
  try {
    const user = await dbGetUserByPhone(data.phone);
    if (!user) {
      return { success: false, error: 'Invalid phone number or password' };
    }

    const isMatch = await verifyPassword(data.password, user.password);
    if (!isMatch) {
      return { success: false, error: 'Invalid phone number or password' };
    }

    const token = generateToken({
      userId: user._id,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, getTokenCookieOptions());

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed' };
  }
}

export async function adminLoginAction(data: AdminLoginFormData) {
  try {
    // For admin, we support a predefined email and password,
    // or we can verify in database if we have admin collections.
    // Predefined admin credentials:
    const ADMIN_EMAIL = 'admin@swagatamcafe.com';
    const ADMIN_PASSWORD = 'adminpassword'; // Simple fallback for local dev

    if (data.email.toLowerCase() === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
      const token = generateToken({
        userId: 'admin_user',
        role: 'admin',
      });

      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, token, getTokenCookieOptions());

      return {
        success: true,
        user: {
          id: 'admin_user',
          name: 'Swagatam Admin',
          email: ADMIN_EMAIL,
          role: 'admin',
        },
      };
    }

    return { success: false, error: 'Invalid email or password' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Admin login failed' };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return { success: true };
  } catch {
    return { success: false, error: 'Logout failed' };
  }
}

export async function getCurrentUserAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    if (payload.role === 'admin') {
      return {
        id: 'admin_user',
        name: 'Swagatam Admin',
        email: 'admin@swagatamcafe.com',
        role: 'admin' as const,
      };
    }

    const user = await dbGetUserById(payload.userId);
    if (!user) return null;

    return {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      addresses: user.addresses,
    };
  } catch {
    return null;
  }
}
