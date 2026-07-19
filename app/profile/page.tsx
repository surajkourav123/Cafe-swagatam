import { ProfileClient } from './profile-client';

export const metadata = {
  title: 'My Profile — Swagatam Cafe',
  description: 'Manage your profile, saved addresses, and view your order history.',
};

export default function ProfilePage() {
  return <ProfileClient />;
}
