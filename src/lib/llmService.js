import { THERAPIST_SYSTEM_PROMPT, SUMMARY_SYSTEM_PROMPT } from './therapistPrompt';

/**
 * Intelligent LLM Service with multi-provider API support and empathetic local fallback engine
 */

export async function generateTherapistResponse(messages, userApiKey = null) {
  const apiKey = userApiKey || process.env.LLM_API_KEY;
  const baseURL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const response = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: THERAPIST_SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply && reply.trim().length > 0) {
          return reply.trim();
        }
      } else {
        console.warn(`LLM API returned status ${response.status}, falling back to clinical engine.`);
      }
    } catch (err) {
      console.warn('LLM API fetch error, falling back to local engine:', err.message);
    }
  }

  // Empathetic Clinical Response Engine (Zero-Key Offline Support)
  return generateContextualTherapyResponse(messages);
}

/**
 * Generate End of Session Synthesis & Coping Steps
 */
export async function generateSessionSummary(messages, userApiKey = null) {
  const apiKey = userApiKey || process.env.LLM_API_KEY;
  const baseURL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const transcript = messages
        .map((m) => `${m.role === 'user' ? 'Client' : 'Clarity'}: ${m.content}`)
        .join('\n\n');

      const response = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
            { role: 'user', content: `Please summarize this session transcript:\n\n${transcript}` },
          ],
          temperature: 0.4,
          response_format: { type: 'json_object' },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            title: parsed.title || 'Therapeutic Reflection Session',
            summary: parsed.summary || 'A space dedicated to processing emotions and cultivating presence.',
            copingSteps: Array.isArray(parsed.copingSteps) ? parsed.copingSteps : [],
          };
        }
      }
    } catch (err) {
      console.warn('LLM summary API error, using clinical extractor:', err);
    }
  }

  // Fallback clinical extractor
  return extractClinicalSummary(messages);
}

/**
 * Contextual clinical generator using CBT/ACT principles
 */
function generateContextualTherapyResponse(messages) {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const lower = lastUserMessage.toLowerCase();

  if (lower.includes('anxi') || lower.includes('worry') || lower.includes('panic') || lower.includes('scared') || lower.includes('nervous')) {
    return (
      `It sounds like anxiety is taking up a significant amount of space inside you right now. That tightness and constant anticipation can feel genuinely exhausting, and I want to validate just how much physical and mental energy it drains from you.\n\n` +
      `When anxiety surges, our nervous system is trying to protect us from a threat it senses, even if that threat is a thought rather than an immediate physical danger. What if we pause for a quiet second together? Notice your feet on the ground and let your shoulders drop slightly.\n\n` +
      `What is the central story that your anxiety is telling you right now? What is it most afraid might happen?`
    );
  }

  if (lower.includes('sad') || lower.includes('depress') || lower.includes('lonely') || lower.includes('crying') || lower.includes('tears') || lower.includes('grief')) {
    return (
      `Thank you for sharing that with me so honestly. Sadness can feel so heavy, like carrying a weight that nobody else can see. I want you to know that whatever you are feeling right now is completely welcome here, without any need to pretend or force yourself to feel differently.\n\n` +
      `Sometimes the most caring thing we can do for ourselves is simply to give our sadness permission to exist, rather than exhausting ourselves fighting against it.\n\n` +
      `If you gently tune into where that sadness sits in your body right now, what does it feel like? And how long have you been carrying this alone?`
    );
  }

  if (lower.includes('work') || lower.includes('job') || lower.includes('boss') || lower.includes('burnout') || lower.includes('career') || lower.includes('stress')) {
    return (
      `Work pressure and burnout have a subtle way of creeping into every corner of our lives until we feel entirely depleted. It makes total sense that you are feeling the strain of these demands.\n\n` +
      `Often, burnout happens not because we are incapable, but because we have been operating beyond our sustainable capacity for far too long without adequate restoration or boundaries.\n\n` +
      `Looking at your current day, where does the boundary between your work obligations and your own peace feel most compromised?`
    );
  }

  if (lower.includes('relationship') || lower.includes('partner') || lower.includes('friend') || lower.includes('family') || lower.includes('argument') || lower.includes('conflict')) {
    return (
      `Navigating relationship tensions is one of the most vulnerable things we experience. When friction occurs with people who matter to us, it naturally activates our deepest feelings about security, belonging, and being understood.\n\n` +
      `It sounds like you are wrestling with a painful disconnect between what you need in this dynamic and what is currently taking place.\n\n` +
      `When you reflect on this conflict, what is the core need or boundary that you wish the other person could truly hear and respect?`
    );
  }

  if (messages.filter((m) => m.role === 'user').length <= 1) {
    return (
      `Welcome to this quiet space. I am Clarity, and I am here to listen with patience, care, and zero judgment.\n\n` +
      `You can speak about whatever is on your mind, whether it is a specific challenge you are facing, heavy emotions you have been holding in, or just a desire to unpack how your day unfolded.\n\n` +
      `Take a gentle breath. What feels most important for you to talk through right now?`
    );
  }

  return (
    `I hear you, and I appreciate you trusting me with what you are experiencing. What you described carries real weight, and it is completely understandable that it is impacting you in this way.\n\n` +
    `When we hold these thoughts quietly inside our heads, they often feel tangled and overwhelming. Putting them into words here is a meaningful first step toward gaining perspective.\n\n` +
    `As you look at what you just shared, which part of it feels like the heaviest burden to carry right now?`
  );
}

/**
 * Extract Clinical Summary without external API
 */
function extractClinicalSummary(messages) {
  const userMessages = messages.filter((m) => m.role === 'user').map((m) => m.content);
  const combined = userMessages.join(' ').toLowerCase();

  let title = 'General Reflection Session';
  let focus = 'navigating emotional balance and personal clarity';

  if (combined.includes('anxi') || combined.includes('worry') || combined.includes('panic')) {
    title = 'Managing Anxiety and Overwhelm';
    focus = 'grounding acute anxiety, identifying catastrophizing loops, and regulating the nervous system';
  } else if (combined.includes('burnout') || combined.includes('work') || combined.includes('job')) {
    title = 'Workplace Boundaries and Burnout Recovery';
    focus = 'unpacking professional exhaustion, setting sustainable workload limits, and honoring mental energy';
  } else if (combined.includes('sad') || combined.includes('depress') || combined.includes('grief')) {
    title = 'Processing Grief and Low Mood';
    focus = 'acknowledging deep sadness without judgment, practicing emotional self-compassion, and reducing isolation';
  } else if (combined.includes('relationship') || combined.includes('partner') || combined.includes('family')) {
    title = 'Relational Communication and Boundaries';
    focus = 'exploring interpersonal tensions, clarifying emotional boundaries, and expressing unmet needs';
  }

  return {
    title,
    summary:
      `In this session, the client explored topics centered around ${focus}. ` +
      `Through open reflection, key triggers and automatic thought patterns were brought into conscious awareness. ` +
      `The dialogue emphasized self-compassion, somatic grounding, and developing a supportive internal posture when facing uncertainty.`,
    copingSteps: [
      'Practice the 5-4-3-2-1 Sensory Grounding exercise whenever you notice mental spiraling: identify 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.',
      'Schedule a dedicated 15-minute "Worry or Reflection Window" each afternoon, allowing yourself to write uncensored thoughts down and physically close the notebook.',
      'Practice self-compassion self-talk: when you catch self-criticism, consciously replace it with "I am doing the best I can with what I have in this moment."',
    ],
  };
}
