import { LoginClient } from './login-client';
import { siteConfig } from '@/config/site.config';

export const metadata = {
  title: `Login | ${siteConfig.name}`,
  description: 'Sign in to your Swagatam Cafe account to manage orders, addresses, and favorites.',
};

export default function LoginPage() {
  return <LoginClient />;
}
