import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('List sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session logs.' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const title = body.title?.trim() || 'Reflection Session';

    // Create session and seed warm initial therapist welcome message
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        title,
        status: 'active',
        messages: {
          create: [
            {
              role: 'assistant',
              content: `Hello ${user.name !== 'Client' && !user.isAnonymous ? user.name : 'there'}. I am Clarity, your AI therapist companion. This is a private, confidential space where you can share whatever you are experiencing without judgment.\n\nTake a slow breath. What is on your mind today?`,
            },
          ],
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize therapy session.' },
      { status: 500 }
    );
  }
}
