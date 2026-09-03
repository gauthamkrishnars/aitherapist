import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST() {
  try {
    const anonymousId = `guest_${Math.random().toString(36).substring(2, 9)}`;

    const user = await prisma.user.create({
      data: {
        email: null,
        passwordHash: null,
        name: `Guest ${anonymousId.slice(-4).toUpperCase()}`,
        isAnonymous: true,
      },
    });

    const token = await signToken({ userId: user.id });
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: null,
        name: user.name,
        isAnonymous: true,
      },
    });

    setAuthCookie(token, response);
    return response;
  } catch (error) {
    console.error('Anonymous auth error:', error);
    return NextResponse.json(
      { error: 'Failed to create anonymous session.' },
      { status: 500 }
    );
  }
}
