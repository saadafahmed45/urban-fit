import { SignJWT, jwtVerify } from 'jose';
import { getToken, decode } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';

const JWT_SECRET = process.env.JWT_SECRET || 'urban_fit_fallback_secret_key_change_me_in_production_123456';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const ADMIN_COOKIE_NAME = 'urban_fit_admin_token';

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

async function getBcrypt() {
  const pkg = ['bcrypt', 'js'].join('');
  const mod = await import(/* webpackIgnore: true */ pkg);
  return mod.default || mod;
}

/**
 * Hash plain password using bcrypt
 */
export async function hashPassword(plainPassword) {
  const bcrypt = await getBcrypt();
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
}

/**
 * Compare plain password against bcrypt hash
 */
export async function comparePassword(plainPassword, hashedPassword) {
  const bcrypt = await getBcrypt();
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Sign an admin JWT payload using jose
 */
export async function signAdminToken(admin) {
  const payload = {
    sub: admin._id?.toString() || admin.id,
    email: admin.email,
    role: admin.role || 'admin',
    name: admin.name || 'Admin',
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);

  return jwt;
}

/**
 * Verify and decode an admin JWT token
 */
export async function verifyAdminToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract and verify admin token from Request object (supports Cookie or Authorization header)
 */
export async function getAdminFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader
      .split(';')
      .map((c) => c.trim().split('='))
      .filter(([k]) => Boolean(k))
  );

  let token = cookies[ADMIN_COOKIE_NAME];

  if (!token) {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) return null;
  return await verifyAdminToken(token);
}

/**
 * Extract and verify authenticated customer from Request via NextAuth.js
 * Supports NextAuth session cookies, JWT bearer headers, and dev fallback tokens
 */
export async function getCustomerFromRequest(request) {
  if (!request) return null;

  // 1. Check for development / test token bypass
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  if (process.env.NODE_ENV !== 'production' && authHeader.startsWith('Bearer test-user-')) {
    const parts = authHeader.slice(7).trim().split('-');
    const uid = parts[2] || 'test_uid_123';
    const email = parts[3] ? `${parts[3]}@urbanfit.local` : 'customer@urbanfit.local';
    return {
      uid,
      id: uid,
      email,
      name: 'Streetwear Member',
      role: 'customer',
    };
  }

  // 2. Parse cookies from request
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = {};
  cookieHeader.split(';').forEach((c) => {
    const [rawKey, ...valParts] = c.trim().split('=');
    if (rawKey) {
      cookies[rawKey.trim()] = valParts.join('=').trim();
    }
  });

  const nextAuthSecret =
    process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'urban_fit_nextauth_fallback_secret_32bytes_long';

  // 3. Check NextAuth JWT via getToken
  try {
    const headersObj = {};
    if (request.headers && typeof request.headers.forEach === 'function') {
      request.headers.forEach((v, k) => {
        headersObj[k] = v;
      });
    }

    const token = await getToken({
      req: { cookies, headers: headersObj },
      secret: nextAuthSecret,
    });

    if (token) {
      const id = token.id || token.sub;
      return {
        uid: id,
        id,
        email: token.email,
        name: token.name || 'Streetwear Member',
        role: token.role || 'customer',
      };
    }
  } catch (err) {
    // Continue to raw decode
  }

  // 4. Try raw session cookie decode
  const rawSessionToken =
    cookies['__Secure-next-auth.session-token'] ||
    cookies['next-auth.session-token'] ||
    (authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null);

  if (rawSessionToken) {
    try {
      const decoded = await decode({ token: rawSessionToken, secret: nextAuthSecret });
      if (decoded) {
        const id = decoded.id || decoded.sub;
        return {
          uid: id,
          id,
          email: decoded.email,
          name: decoded.name || 'Streetwear Member',
          role: decoded.role || 'customer',
        };
      }
    } catch (e) {
      // Decode failed
    }
  }

  return null;
}

/**
 * Get NextAuth session in Server Components or Route Handlers
 */
export async function getCustomerSession() {
  return await getServerSession(authOptions);
}
