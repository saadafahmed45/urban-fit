import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'urban_fit_fallback_secret_key_change_me_in_production_123456';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const ADMIN_COOKIE_NAME = 'urban_fit_admin_token';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow login/logout routes without verification
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/auth/login') ||
    pathname.startsWith('/api/admin/auth/logout')
  ) {
    return NextResponse.next();
  }

  // 1. Protect Admin API routes (/api/admin/**)
  if (pathname.startsWith('/api/admin')) {
    let token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized. Admin credentials required.', meta: null },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, secretKey);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.json(
        { success: false, data: null, error: 'Invalid or expired admin session token.', meta: null },
        { status: 401 }
      );
    }
  }

  // 2. Protect Admin Frontend Pages (/admin/**)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, secretKey);
      return NextResponse.next();
    } catch (err) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
