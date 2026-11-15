import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAIResponse } from '../utils/validateAIResponse.js';

/**
 * Generate high-quality fallback demo data tailored to the requested topic & type
 */
const generateDemoData = ({ topic, prompt, subject = 'General Studies', type = 'flashcards', difficulty = 'intermediate', count = 5 }) => {
  const effectiveTopic = topic || prompt || 'Computer Science Fundamentals';

  if (type === 'flashcards') {
    const flashcardTemplates = {
      default: [
        {
          question: `What is the core definition and primary objective of ${effectiveTopic}?`,
          answer: `${effectiveTopic} refers to the foundational principles, workflows, and core mechanisms designed to optimize understanding, problem solving, and analytical execution in this domain.`,
        },
        {
          question: `What are the key components and building blocks involved in ${effectiveTopic}?`,
          answer: `The primary components include structural foundations, algorithmic data flows, feedback loops, and state management strategies.`,
        },
        {
          question: `What are the main advantages and trade-offs when applying ${effectiveTopic}?`,
          answer: `Advantages include increased efficiency, predictability, and scalability. Trade-offs typically involve initial complexity and memory/resource overhead.`,
        },
        {
          question: `How does difficulty level (${difficulty}) influence the implementation of ${effectiveTopic}?`,
          answer: `At the ${difficulty} tier, focus shifts towards edge-case handling, performance optimization, concurrency, and resilient error recovery.`,
        },
        {
          question: `What is an essential best practice to remember when working with ${effectiveTopic}?`,
          answer: `Maintain modularity, validate inputs early, document state transitions, and rigorously benchmark critical paths.`,
        },
        {
          question: `What common misconceptions exist regarding ${effectiveTopic}?`,
          answer: `A frequent misconception is assuming simple patterns fit every scenario without profiling and evaluating architectural constraints.`,
        },
        {
          question: `How is ${effectiveTopic} evaluated or verified in real-world environments?`,
          answer: `Through automated unit testing, end-to-end integration workflows, telemetry monitoring, and peer reviews.`,
        },
      ],
    };

    const cards = flashcardTemplates.default.slice(0, Math.min(count, 7)).map((c, i) => ({
      id: `demo-card-${i + 1}`,
      question: c.question,
      answer: c.answer,
      category: subject,
    }));

    return {
      success: true,
      isDemo: true,
      type: 'flashcards',
      title: `${effectiveTopic} Study Deck`,
      subject: subject || 'Science & Tech',
      difficulty,
      cards,
    };
  }

  if (type === 'quiz') {
    const questions = [
      {
        id: 'demo-q-1',
        question: `Which of the following best describes the core principle of ${effectiveTopic}?`,
        options: [
          `A systematic methodology for organizing and executing workflows efficiently`,
          `An unverified legacy approach with no structured benchmarks`,
          `A purely visual styling technique with no logic or state`,
          `A deprecated protocol replaced by static configuration files`,
        ],
        correctAnswer: `A systematic methodology for organizing and executing workflows efficiently`,
        explanation: `${effectiveTopic} is fundamentally centered on structured, deterministic methodology and consistent execution.`,
      },
      {
        id: 'demo-q-2',
        question: `When working with ${effectiveTopic} at a ${difficulty} level, what is the primary consideration?`,
        options: [
          `Ensuring fault tolerance, modularity, and reproducible states`,
          `Ignoring error bounds to optimize speed`,
          `Relying exclusively on default global variables`,
          `Avoiding automated validation to save compute cycles`,
        ],
        correctAnswer: `Ensuring fault tolerance, modularity, and reproducible states`,
        explanation: `At the ${difficulty} stage, robust error handling, boundaries, and modular structure are critical.`,
      },
      {
        id: 'demo-q-3',
        question: `What is a key metric typically used to assess the effectiveness of ${effectiveTopic}?`,
        options: [
          `Accuracy, throughput, and error recovery rate`,
          `Total file byte length alone`,
          `The quantity of raw console log statements`,
          `The number of arbitrary third-party plugins installed`,
        ],
        correctAnswer: `Accuracy, throughput, and error recovery rate`,
        explanation: `Key performance indicators focus on reliability, throughput, and resilient recovery.`,
      },
      {
        id: 'demo-q-4',
        question: `True or False: In ${effectiveTopic}, deterministic state management leads to higher predictability.`,
        options: [
          `True`,
          `False`,
        ],
        correctAnswer: `True`,
        explanation: `Deterministic states eliminate race conditions and make debugging and testing straightforward.`,
      },
      {
        id: 'demo-q-5',
        question: `Which architectural pattern is most frequently recommended for scaling ${effectiveTopic}?`,
        options: [
          `Layered separation of concerns and clear data flow contracts`,
          `Monolithic global scope with tight coupling`,
          `Hardcoding connection strings directly into components`,
          `Bypassing schema validation layers altogether`,
        ],
        correctAnswer: `Layered separation of concerns and clear data flow contracts`,
        explanation: `Separation of concerns allows independent evolution, testing, and scaling of each subsystem.`,
      },
    ].slice(0, Math.min(count, 5));

    return {
      success: true,
      isDemo: true,
      type: 'quiz',
      title: `${effectiveTopic} Assessment Quiz`,
      subject: subject || 'General Studies',
      difficulty,
      questions,
    };
  }

  if (type === 'study-guide') {
    return {
      success: true,
      isDemo: true,
      type: 'study-guide',
      title: `Comprehensive Guide to ${effectiveTopic}`,
      subject: subject || 'General Studies',
      difficulty,
      summary: `This master study guide examines the core mechanics, architectural considerations, and practical applications of ${effectiveTopic}. Designed for ${difficulty}-level mastery, it provides structured breakdowns, definitions, and real-world examples.`,
      keyConcepts: [
        `Core Architecture & Syntax`,
        `State Isolation & Lifecycle Management`,
        `Optimization & Critical Path Performance`,
        `Failure Modes & Defensive Recovery`,
      ],
      sections: [
        {
          id: 'sec-1',
          title: '1. Fundamentals and Theoretical Foundations',
          content: `${effectiveTopic} establishes the mental models required to understand how interconnected modules communicate. Understanding how data transforms from raw input to structured output guarantees solid engineering and conceptual clarity.`,
          keyPoints: [
            'Clear domain boundaries prevent state corruption.',
            'Explicit types and contracts prevent runtime anomalies.',
            'Decoupled architecture improves reusability.',
          ],
          example: `Example: In modern architectures, separating input parsing from business logic allows isolated unit testing without external dependencies.`,
        },
        {
          id: 'sec-2',
          title: '2. Deep Dive: Key Mechanisms & Workflow',
          content: `When handling practical scenarios, the execution pipeline follows a defined path: Initialization -> Processing -> Verification -> Resolution. Each stage must provide idempotency and deterministic outcomes.`,
          keyPoints: [
            'Pipeline execution should be predictable and observable.',
            'Feedback loops must provide descriptive diagnostics.',
            'Resource utilization scales linearly when properly indexed.',
          ],
          example: `Consider how request pipelines validate incoming schemas before delegating to database transactions.`,
        },
        {
          id: 'sec-3',
          title: '3. Common Pitfalls & Anti-Patterns',
          content: `Learners frequently stumble upon tightly-coupled state, premature micro-optimizations, and neglecting defensive boundaries. Avoiding these early preserves agility and velocity.`,
          keyPoints: [
            'Do not mix presentation concerns with domain calculations.',
            'Avoid silent failures: log and handle exceptions with context.',
            'Audit dependencies regularly for deprecations and vulnerabilities.',
          ],
          example: `Anti-pattern: Using unvalidated strings directly in query builders instead of parameterized schemas.`,
        },
      ],
    };
  }

  if (type === 'summary') {
    return {
      success: true,
      isDemo: true,
      type: 'summary',
      title: `Executive Summary: ${effectiveTopic}`,
      subject: subject || 'General Studies',
      difficulty,
      readingTime: '3 min read',
      summary: `${effectiveTopic} serves as a pivotal discipline in modern problem solving. By prioritizing clear interfaces, structured data ingestion, and rigorous feedback mechanisms, learners and practitioners can master complex challenges with elevated confidence and measurable results.`,
      mainTakeaways: [
        `Solid grasp of core definitions accelerates advanced concept comprehension.`,
        `Systematic evaluation and error handling distinguish beginners from proficient practitioners.`,
        `Regular active-recall practice with flashcards and quizzes dramatically improves retention by up to 200%.`,
      ],
    };
  }

  // Mixed fallback
  return {
    success: true,
    isDemo: true,
    type: 'mixed',
    title: `${effectiveTopic} Mixed Learning Pack`,
    subject: subject || 'General Studies',
    difficulty,
    summary: `A complete starter pack covering flashcards, self-assessment questions, and core guidelines for ${effectiveTopic}.`,
    cards: [
      { id: 'mix-1', question: `What is ${effectiveTopic}?`, answer: `The core subject material focused on systematic mastery.` },
      { id: 'mix-2', question: `What is the main objective?`, answer: `To achieve deep comprehension and practical application.` },
    ],
    questions: [
      {
        id: 'mix-q-1',
        question: `Is ${effectiveTopic} fundamental for ${subject}?`,
        options: ['Yes, highly essential', 'No, completely unrelated'],
        correctAnswer: 'Yes, highly essential',
        explanation: 'It provides foundational knowledge critical to the discipline.',
      },
    ],
  };
};

/**
 * AI Service for generating educational materials
 */
export const generateStudyContent = async ({ prompt, topic, subject, type, difficulty, count = 5 }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key is set, immediately provide rich demo fallback data
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.log('[AI Service] No Gemini API key detected. Using high-fidelity Demo Mode generator.');
    const demoData = generateDemoData({ prompt, topic, subject, type, difficulty, count });
    return validateAIResponse(demoData, type);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-1.5-flash',
    ];

    let result = null;
    let selectedModelName = '';
    let lastError = null;

    const systemPrompt = `You are an elite educational content generator for StudyFlow AI.
Generate strictly structured, valid JSON with NO Markdown fences, NO triple backticks, and NO additional text.
Subject: ${subject || 'General'}
Difficulty: ${difficulty || 'intermediate'}
Target Quantity: ${count || 5}
Requested Type: ${type}
Topic / Notes: ${topic || prompt}

Schema requirements:
If type is "flashcards":
{
  "title": "string",
  "subject": "string",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "cards": [
    { "id": "card-1", "question": "string", "answer": "string" }
  ]
}

If type is "quiz":
{
  "title": "string",
  "subject": "string",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "questions": [
    {
      "id": "q-1",
      "question": "string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Exact matching string from options",
      "explanation": "Detailed explanation why this answer is correct"
    }
  ]
}

If type is "study-guide":
{
  "title": "string",
  "subject": "string",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "summary": "Overview paragraph",
  "keyConcepts": ["Concept 1", "Concept 2"],
  "sections": [
    {
      "id": "sec-1",
      "title": "Section Title",
      "content": "Deep conceptual explanation",
      "keyPoints": ["Point A", "Point B"],
      "example": "Practical illustrative example"
    }
  ]
}

If type is "summary":
{
  "title": "string",
  "subject": "string",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "summary": "Comprehensive summary text",
  "mainTakeaways": ["Takeaway 1", "Takeaway 2"],
  "readingTime": "X min read"
}

Provide accurate, pedagogically sound, and engaging educational material.`;

    for (const mName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: mName });
        result = await model.generateContent(systemPrompt);
        selectedModelName = mName;
        break;
      } catch (err) {
        lastError = err;
        console.warn(`[AI Service] Model ${mName} unavailable (${err.message}), trying next candidate...`);
      }
    }

    if (!result) {
      throw lastError || new Error('All candidate Gemini models failed to generate content.');
    }

    const response = await result.response;
    const rawText = response.text();
    console.log(`[AI Service] Live response received from ${selectedModelName}`);

    // Clean any markdown formatting if present
    const cleanedJson = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);
    const validated = validateAIResponse(parsed, type);
    return { ...validated, isDemo: false, model: selectedModelName };
  } catch (error) {
    console.warn(`[AI Service] Gemini API call failed (${error.message}). Falling back to robust Demo Mode generator.`);
    const fallbackData = generateDemoData({ prompt, topic, subject, type, difficulty, count });
    return { ...validateAIResponse(fallbackData, type), isDemo: true, fallbackNotice: error.message };
  }
};
