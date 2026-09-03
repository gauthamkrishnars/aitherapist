import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { generateSessionSummary } from '@/lib/llmService';

export async function POST(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session || session.userId !== user.id) {
      return NextResponse.json(
        { error: 'Session not found or unauthorized.' },
        { status: 404 }
      );
    }

    // Generate AI clinical synthesis and coping steps
    const synthesis = await generateSessionSummary(session.messages);

    const updated = await prisma.session.update({
      where: { id },
      data: {
        status: 'completed',
        title: session.title === 'Therapy Session' || session.title === 'Reflection Session' ? synthesis.title : session.title,
        summary: synthesis.summary,
        copingSteps: JSON.stringify(synthesis.copingSteps),
        endedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      session: updated,
      title: updated.title,
      summary: synthesis.summary,
      copingSteps: synthesis.copingSteps,
    });
  } catch (error) {
    console.error('End session error:', error);
    return NextResponse.json(
      { error: 'Failed to generate session recap.' },
      { status: 500 }
    );
  }
}
