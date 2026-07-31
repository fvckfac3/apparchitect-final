import type { InterviewAnswers, InterviewPhase } from '@/types/interview';
import { chat } from '@/lib/ai-providers';

export interface AdaptiveQuestion {
  id: string;
  text: string;
  placeholder: string;
  guidance: string;
}

interface RoundContext {
  phase: InterviewPhase;
  title: string;
  subtitle: string;
  questions: Array<{ id: string; text: string }>;
}

const FALLBACKS: Record<InterviewPhase, AdaptiveQuestion> = {
  concept: {
    id: 'adaptive-concept-risk',
    text: 'What is the biggest assumption about your users or product that still needs to be proven?',
    placeholder: 'The assumption I most need to test is...',
    guidance: 'Name the belief that could most change the product if it proves wrong, and how you would test it.',
  },
  features: {
    id: 'adaptive-features-edge-case',
    text: 'Which core workflow is most important to get right, and what could go wrong for the user?',
    placeholder: 'The workflow that matters most is...',
    guidance: 'Describe the happy path, the most likely failure, and how the product should recover.',
  },
  technical: {
    id: 'adaptive-technical-constraint',
    text: 'What technical constraint or integration could limit the first version of this product?',
    placeholder: 'The constraint I am most concerned about is...',
    guidance: 'Include vendor limits, privacy, performance, platform, budget, or operational concerns.',
  },
  depth: {
    id: 'adaptive-launch-decision',
    text: 'What would make you decide this product is ready to launch, and what would make you stop or rethink it?',
    placeholder: 'I would launch when...',
    guidance: 'Give concrete success criteria, launch risks, and a signal that would cause a change in direction.',
  },
  complete: {
    id: 'adaptive-final-clarity',
    text: 'What is the one detail an implementation team must not get wrong?',
    placeholder: 'The detail that must not be missed is...',
    guidance: 'State the product decision or user promise that should anchor the entire PRD suite.',
  },
};

function compactAnswers(answers: InterviewAnswers): string {
  return Object.entries(answers)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join('\n')
    .slice(0, 12000);
}

function parseQuestion(content: string, phase: InterviewPhase): AdaptiveQuestion | null {
  const cleaned = content.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<AdaptiveQuestion>;
    if (typeof parsed.text !== 'string' || parsed.text.length < 20) return null;
    return {
      id: `adaptive-${phase}`,
      text: parsed.text.trim(),
      placeholder: typeof parsed.placeholder === 'string' ? parsed.placeholder : 'Your answer...',
      guidance: typeof parsed.guidance === 'string' ? parsed.guidance : 'Be concrete and include the reason behind your answer.',
    };
  } catch {
    return null;
  }
}

export async function generateAdaptiveFollowUp(
  answers: InterviewAnswers,
  context: RoundContext,
): Promise<AdaptiveQuestion> {
  const fallback = FALLBACKS[context.phase];
  try {
    const response = await chat({
      messages: [
        {
          role: 'system',
          content: 'You are AppArchitect\'s adaptive product interviewer. Return only valid JSON with keys text, placeholder, and guidance. Ask exactly one specific follow-up question that is not already in the supplied questions. Focus on an ambiguity, risk, or decision that materially affects implementation. Never ask for information already answered.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            phase: context.phase,
            section: context.title,
            sectionSubtitle: context.subtitle,
            existingQuestions: context.questions,
            answers: compactAnswers(answers),
          }),
        },
      ],
      temperature: 0.35,
      maxTokens: 300,
    });
    return parseQuestion(response.content, context.phase) || fallback;
  } catch {
    return fallback;
  }
}
