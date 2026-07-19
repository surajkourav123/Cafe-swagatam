import { DashboardClient } from './dashboard-client';

export const metadata = {
  title: 'Dashboard — Swagatam Cafe Admin',
  description: 'Control panel for monitoring sales metrics and food order traffic.',
};

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
