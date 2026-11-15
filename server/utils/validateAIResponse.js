/**
 * Validates and cleans structured AI responses for different study material types.
 */
export const validateAIResponse = (data, expectedType) => {
  if (!data || typeof data !== 'object') {
    throw new Error('AI output is empty or not a valid JSON object.');
  }

  // Basic meta validation
  const title = (data.title || 'Untitled Study Set').trim();
  const subject = (data.subject || 'General Studies').trim();
  const difficulty = ['beginner', 'intermediate', 'advanced'].includes(data.difficulty)
    ? data.difficulty
    : 'intermediate';

  const type = expectedType || data.type || 'flashcards';

  if (type === 'flashcards') {
    if (!Array.isArray(data.cards) || data.cards.length === 0) {
      throw new Error('Flashcard generation must contain an array of cards with questions and answers.');
    }

    const validatedCards = data.cards.map((card, idx) => {
      const q = card.question || card.front || card.term || '';
      const a = card.answer || card.back || card.definition || '';
      if (!q.trim() || !a.trim()) {
        throw new Error(`Flashcard #${idx + 1} is missing question or answer.`);
      }
      return {
        id: card.id || `card-${Date.now()}-${idx + 1}`,
        question: q.trim(),
        answer: a.trim(),
        category: card.category || subject,
      };
    });

    return {
      success: true,
      type: 'flashcards',
      title,
      subject,
      difficulty,
      cards: validatedCards,
    };
  }

  if (type === 'quiz') {
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error('Quiz generation must contain an array of questions.');
    }

    const validatedQuestions = data.questions.map((q, idx) => {
      const questionText = q.question || q.prompt || '';
      if (!questionText.trim()) {
        throw new Error(`Quiz Question #${idx + 1} is missing question text.`);
      }

      let options = Array.isArray(q.options) ? q.options : [];
      if (options.length < 2) {
        options = ['True', 'False'];
      }

      let correctAnswer = q.correctAnswer || q.answer || options[0];
      if (!options.includes(correctAnswer)) {
        // Fallback to first option if exact match isn't present
        options.push(correctAnswer);
      }

      return {
        id: q.id || `q-${Date.now()}-${idx + 1}`,
        question: questionText.trim(),
        options: options.map(o => String(o).trim()),
        correctAnswer: String(correctAnswer).trim(),
        explanation: (q.explanation || 'Review the topic concepts to understand this answer.').trim(),
      };
    });

    return {
      success: true,
      type: 'quiz',
      title,
      subject,
      difficulty,
      questions: validatedQuestions,
    };
  }

  if (type === 'study-guide') {
    const summary = data.summary || data.overview || '';
    const sections = Array.isArray(data.sections) ? data.sections : [];
    const keyConcepts = Array.isArray(data.keyConcepts) ? data.keyConcepts : [];

    if (!summary && sections.length === 0) {
      throw new Error('Study Guide must contain a summary or structured sections.');
    }

    const validatedSections = sections.map((sec, idx) => ({
      id: sec.id || `sec-${idx + 1}`,
      title: (sec.title || `Section ${idx + 1}`).trim(),
      content: (sec.content || '').trim(),
      keyPoints: Array.isArray(sec.keyPoints) ? sec.keyPoints : [],
      example: sec.example || null,
    }));

    return {
      success: true,
      type: 'study-guide',
      title,
      subject,
      difficulty,
      summary,
      keyConcepts,
      sections: validatedSections,
    };
  }

  if (type === 'summary') {
    const mainTakeaways = Array.isArray(data.mainTakeaways) ? data.mainTakeaways : [];
    const summary = data.summary || data.overview || data.text || '';

    if (!summary.trim()) {
      throw new Error('Summary content is missing.');
    }

    return {
      success: true,
      type: 'summary',
      title,
      subject,
      difficulty,
      summary: summary.trim(),
      mainTakeaways,
      readingTime: data.readingTime || '3 min read',
    };
  }

  if (type === 'mixed') {
    // Mixed pack contains both cards, quiz questions, and a summary
    const cards = Array.isArray(data.cards) ? data.cards : [];
    const questions = Array.isArray(data.questions) ? data.questions : [];
    const summary = data.summary || '';

    return {
      success: true,
      type: 'mixed',
      title,
      subject,
      difficulty,
      summary,
      cards: cards.map((c, i) => ({
        id: c.id || `mix-card-${i + 1}`,
        question: c.question || 'Concept',
        answer: c.answer || 'Explanation',
      })),
      questions: questions.map((q, i) => ({
        id: q.id || `mix-q-${i + 1}`,
        question: q.question || 'Question',
        options: Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D'],
        correctAnswer: q.correctAnswer || (q.options ? q.options[0] : 'A'),
        explanation: q.explanation || '',
      })),
    };
  }

  return {
    success: true,
    type: 'custom',
    title,
    subject,
    difficulty,
    content: data,
  };
};
