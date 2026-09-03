import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { evaluateSafetyRisk, buildCrisisAssistantResponse } from '@/lib/safety';
import { generateTherapistResponse } from '@/lib/llmService';

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { sessionId, message, userApiKey } = await req.json();

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message content is required.' },
        { status: 400 }
      );
    }

    // Verify session
    let session = null;
    if (sessionId) {
      session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20, // last 20 messages for context
          },
        },
      });
    }

    if (!session || session.userId !== user.id) {
      // Auto-create active session if none found or expired
      session = await prisma.session.create({
        data: {
          userId: user.id,
          title: 'Reflection Session',
          status: 'active',
        },
        include: {
          messages: true,
        },
      });
    }

    const cleanInput = message.trim();

    // Safety crisis analysis middleware
    const safetyCheck = evaluateSafetyRisk(cleanInput);

    if (safetyCheck.isCrisis) {
      // Record user message
      await prisma.message.create({
        data: {
          sessionId: session.id,
          role: 'user',
          content: cleanInput,
        },
      });

      const crisisResponse = buildCrisisAssistantResponse();

      // Record crisis assistant message
      const assistantMsg = await prisma.message.create({
        data: {
          sessionId: session.id,
          role: 'assistant',
          content: crisisResponse,
        },
      });

      return NextResponse.json({
        isCrisis: true,
        level: safetyCheck.level,
        resources: safetyCheck.resources,
        message: assistantMsg,
        sessionId: session.id,
      });
    }

    // Persist user message
    const userMsg = await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: cleanInput,
      },
    });

    // Formulate conversation context
    const conversationHistory = [
      ...session.messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: cleanInput },
    ];

    // Generate empathetic therapist response
    const therapistReplyText = await generateTherapistResponse(conversationHistory, userApiKey);

    // Persist therapist message
    const assistantMsg = await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: therapistReplyText,
      },
    });

    return NextResponse.json({
      isCrisis: false,
      level: safetyCheck.level, // might be 'elevated'
      resources: safetyCheck.level === 'elevated' ? safetyCheck.resources : null,
      message: assistantMsg,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Therapist dialogue service temporarily interrupted.' },
      { status: 500 }
    );
  }
}
