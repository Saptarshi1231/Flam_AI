import api from './api.js';

export const aiService = {
  async generate({ prompt, topic, subject, type, difficulty, count = 5 }) {
    try {
      const res = await api.post('/ai/generate', {
        prompt,
        topic,
        subject,
        type,
        difficulty,
        count,
      });
      return res.data;
    } catch (err) {
      console.warn('[AI Service] Backend AI endpoint failed, falling back to instant client generator:', err.message);
      // Client-side fallback generator to ensure zero blockage
      return generateLocalFallback({ prompt, topic, subject, type, difficulty, count });
    }
  },

  async refine({ content, instruction, type }) {
    try {
      const res = await api.post('/ai/refine', { content, instruction, type });
      return res.data;
    } catch (err) {
      return content;
    }
  },
};

function generateLocalFallback({ prompt, topic, subject = 'General Studies', type = 'flashcards', difficulty = 'intermediate', count = 5 }) {
  const effectiveTopic = topic || prompt || 'Study Topic';

  if (type === 'flashcards') {
    return {
      success: true,
      isDemo: true,
      type: 'flashcards',
      title: `${effectiveTopic} Quick Review`,
      subject,
      difficulty,
      cards: [
        {
          id: 'fb-1',
          question: `What is the core definition and concept of ${effectiveTopic}?`,
          answer: `${effectiveTopic} encompasses foundational principles, structures, and behavioral characteristics within ${subject}.`,
        },
        {
          id: 'fb-2',
          question: `What are the primary mechanisms driving ${effectiveTopic}?`,
          answer: `Key drivers include state coordination, input processing pipelines, and feedback optimization.`,
        },
        {
          id: 'fb-3',
          question: `How does difficulty level (${difficulty}) affect mastery of ${effectiveTopic}?`,
          answer: `At the ${difficulty} level, attention shifts to architectural trade-offs, edge-case resilience, and throughput.`,
        },
        {
          id: 'fb-4',
          question: `What is a common pitfall when studying or applying ${effectiveTopic}?`,
          answer: `Assuming shallow memorization replaces understanding of underlying causal mechanisms.`,
        },
      ].slice(0, count),
    };
  }

  if (type === 'quiz') {
    return {
      success: true,
      isDemo: true,
      type: 'quiz',
      title: `${effectiveTopic} Mastery Quiz`,
      subject,
      difficulty,
      questions: [
        {
          id: 'fb-q-1',
          question: `Which statement accurately captures the primary function of ${effectiveTopic}?`,
          options: [
            `It establishes foundational logic and organized structures for ${subject}`,
            `It acts merely as an unmonitored temporary cache`,
            `It is an obsolete concept with no modern relevance`,
            `It only operates in synchronous legacy mainframes`,
          ],
          correctAnswer: `It establishes foundational logic and organized structures for ${subject}`,
          explanation: `${effectiveTopic} provides structured logic and methodology essential for the subject domain.`,
        },
        {
          id: 'fb-q-2',
          question: `True or False: Structured feedback improves mastery of ${effectiveTopic}.`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Iterative feedback accelerates error correction and reinforces neural pathways.',
        },
      ],
    };
  }

  // Study guide fallback
  return {
    success: true,
    isDemo: true,
    type: 'study-guide',
    title: `Mastery Guide: ${effectiveTopic}`,
    subject,
    difficulty,
    summary: `A structured overview of ${effectiveTopic} focusing on high-impact concepts and core principles.`,
    keyConcepts: ['Core Foundations', 'Systemic Dynamics', 'Practical Applications'],
    sections: [
      {
        id: 'sec-1',
        title: '1. Overview and Core Concept',
        content: `${effectiveTopic} forms a crucial component of ${subject}. Mastery requires understanding the interconnected layers.`,
        keyPoints: ['Foundational rules govern behavior', 'Inputs dictate state transformation'],
        example: 'Example: Breaking down components into small review chunks increases retention.',
      },
    ],
  };
}
