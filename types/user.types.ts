export interface IUser {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'customer';
  favorites: string[];
  addresses: IAddress[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAddress {
  _id?: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  village: string;
  address: string;
  landmark?: string;
  isDefault: boolean;
}

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  password: string;
  email?: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}
