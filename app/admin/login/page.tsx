import { AdminLoginClient } from './admin-login-client';

export const metadata = {
  title: 'Staff Login — Swagatam Cafe Admin',
  description: 'Access the admin dashboard to manage orders, menu items, and coupons.',
};

export default function AdminPage() {
  return <AdminLoginClient />;
}
