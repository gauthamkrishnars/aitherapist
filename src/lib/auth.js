import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'clarity-ai-therapist-default-secret-key-32-chars-long'
);

const COOKIE_NAME = 'clarity_auth_token';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isAnonymous: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('getAuthUser error:', error);
    return null;
  }
}

export function setAuthCookie(token, response) {
  // If response provided, set on headers, otherwise set via next/headers cookies()
  const options = {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  };

  if (response?.cookies) {
    response.cookies.set(options);
  } else {
    try {
      cookies().set(options);
    } catch (e) {
      // ignore outside request context
    }
  }
}

export function clearAuthCookie(response) {
  const options = {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  };

  if (response?.cookies) {
    response.cookies.set(options);
  } else {
    try {
      cookies().set(options);
    } catch (e) {
      // ignore
    }
  }
}
