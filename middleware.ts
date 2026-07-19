import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that require authentication here
const protectedPaths = ['/profile', '/order'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Basic rate limiting could go here using Edge compatible libraries or Vercel KV

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    const token = request.cookies.get('swagatam-auth-token');

    if (!token) {
      // Redirect to login if trying to access a protected route without a token
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Note: We don't verify the JWT signature here because standard jsonwebtoken 
    // doesn't work in Edge runtime. Full verification happens in API routes or Server Actions.
  }

  // Handle Admin routes specific protection
  if (pathname.startsWith('/admin') && pathname !== '/admin' && pathname !== '/admin/' && pathname !== '/admin/login') {
       const token = request.cookies.get('swagatam-auth-token');
       if(!token) {
           return NextResponse.redirect(new URL('/admin/login', request.url));
       }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
