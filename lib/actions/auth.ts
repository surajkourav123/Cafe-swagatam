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
  dbGetUserById,
  checkDBConnected,
  loadFileDB,
  saveFileDB
} from '@/lib/db-helper';
import Admin from '@/models/admin.model';
import User from '@/models/user.model';
import { loginSchema, registerSchema, adminLoginSchema } from '@/lib/validations';
import type { LoginFormData, RegisterFormData, AdminLoginFormData } from '@/lib/validations';

const COOKIE_NAME = 'swagatam-auth-token';

export async function registerAction(data: RegisterFormData) {
  try {
    const validated = registerSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }
    const validatedData = validated.data;

    const existingUser = await dbGetUserByPhone(validatedData.phone);
    if (existingUser) {
      return { success: false, error: 'Phone number already registered' };
    }

    const hashedPassword = await hashPassword(validatedData.password);
    const user = await dbCreateUser({
      name: validatedData.name,
      phone: validatedData.phone,
      password: hashedPassword,
      email: validatedData.email,
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
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }
    const validatedData = validated.data;

    const user = await dbGetUserByPhone(validatedData.phone, true);
    if (!user) {
      return { success: false, error: 'Invalid phone number or password' };
    }

    const isMatch = await verifyPassword(validatedData.password, user.password);
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
    const validated = adminLoginSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }
    const validatedData = validated.data;

    const isConnected = await checkDBConnected();
    if (isConnected) {
      const adminUser = await Admin.findOne({ email: validatedData.email.toLowerCase() }).select('+password');
      if (adminUser && adminUser.password) {
        const isMatch = await verifyPassword(validatedData.password, adminUser.password);
        if (isMatch) {
          const token = generateToken({
            userId: adminUser._id.toString(),
            role: 'admin',
          });

          const cookieStore = await cookies();
          cookieStore.set(COOKIE_NAME, token, getTokenCookieOptions());

          return {
            success: true,
            user: {
              id: adminUser._id.toString(),
              name: adminUser.name,
              email: adminUser.email,
              role: 'admin',
            },
          };
        }
      }
    }

    // Fallback credentials for local dev / mock DB mode
    if (!isConnected) {
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@swagatamcafe.com';
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword';

      if (validatedData.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && validatedData.password === ADMIN_PASSWORD) {
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
      if (payload.userId === 'admin_user') {
        return {
          id: 'admin_user',
          name: 'Swagatam Admin',
          email: process.env.ADMIN_EMAIL || 'admin@swagatamcafe.com',
          role: 'admin' as const,
        };
      }

      const adminUser = await Admin.findById(payload.userId);
      if (adminUser) {
        return {
          id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email,
          role: 'admin' as const,
        };
      }
      return null;
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

export async function resetPasswordAction(data: { phone: string; name: string; newPassword: string }) {
  try {
    if (!data.phone.match(/^[6-9]\d{9}$/)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian phone number' };
    }
    if (!data.name.trim()) {
      return { success: false, error: 'Please enter your registered full name' };
    }
    if (data.newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters' };
    }

    const user = await dbGetUserByPhone(data.phone);
    if (!user) {
      return { success: false, error: 'No user registered with this phone number' };
    }

    if (user.name.toLowerCase().trim() !== data.name.toLowerCase().trim()) {
      return { success: false, error: 'Name does not match our records' };
    }

    const hashedPassword = await hashPassword(data.newPassword);
    const isConnected = await checkDBConnected();
    if (isConnected) {
      await User.findByIdAndUpdate(user._id || user.id, { password: hashedPassword });
    } else {
      const db = loadFileDB();
      const dbUserIdx = db.users.findIndex(u => u.phone === data.phone);
      if (dbUserIdx !== -1) {
        db.users[dbUserIdx].password = hashedPassword;
        saveFileDB(db);
      }
    }

    return { success: true, message: 'Password reset successfully. You can now login!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Password reset failed' };
  }
}

export async function sendOtpAction(phone: string) {
  try {
    if (!phone.match(/^[6-9]\d{9}$/)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian phone number' };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create secure token (reuse token payload field for validation)
    const otpToken = generateToken({
      userId: phone,
      role: otp as any,
    });

    const cookieStore = await cookies();
    cookieStore.set('swagatam-otp-token', otpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5 * 60, // 5 minutes
      path: '/',
    });

    // Send real SMS if Fast2SMS key is configured
    let realSMSSent = false;
    if (process.env.FAST2SMS_API_KEY) {
      try {
        const smsRes = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&variables_values=${otp}&route=otp&numbers=${phone}`);
        const smsData = await smsRes.json();
        if (smsData.return) {
          realSMSSent = true;
        }
      } catch (err) {
        console.error('Failed to send real SMS via Fast2SMS:', err);
      }
    }

    return { 
      success: true, 
      otp: realSMSSent ? undefined : otp,
      message: realSMSSent 
        ? 'OTP sent successfully to your mobile number via SMS!' 
        : 'Demo Mode: OTP sent! Please check the toast notification for your code.'
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send OTP' };
  }
}

export async function verifyOtpAction(phone: string, otpInput: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('swagatam-otp-token')?.value;
    if (!token) {
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    const payload = verifyToken(token);
    if (!payload || payload.userId !== phone || payload.role !== otpInput) {
      return { success: false, error: 'Invalid OTP code. Please try again.' };
    }

    // OTP is valid! Delete the cookie
    cookieStore.delete('swagatam-otp-token');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'OTP verification failed' };
  }
}
