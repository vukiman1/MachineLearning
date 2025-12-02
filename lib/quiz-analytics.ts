export interface QuizAttempt {
  topicId: string;
  topicTitle: string;
  quizVersion: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: string;
  timeSpent?: number; // in seconds
}

export interface QuizAnalytics {
  attempts: QuizAttempt[];
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  topicStats: Record<
    string,
    {
      attempts: number;
      averageScore: number;
      bestScore: number;
    }
  >;
}

const STORAGE_KEY = "ml-hub-quiz-analytics";

export function saveQuizAttempt(attempt: QuizAttempt): void {
  const analytics = getQuizAnalytics();
  analytics.attempts.push(attempt);

  // Update statistics
  analytics.totalAttempts = analytics.attempts.length;
  analytics.averageScore = calculateAverageScore(analytics.attempts);
  analytics.bestScore = Math.max(
    ...analytics.attempts.map((a) => a.percentage)
  );

  // Update topic stats
  updateTopicStats(analytics, attempt);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics));
}

export function getQuizAnalytics(): QuizAnalytics {
  if (typeof window === "undefined") {
    return getEmptyAnalytics();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getEmptyAnalytics();

    const analytics = JSON.parse(stored) as QuizAnalytics;
    return analytics;
  } catch {
    return getEmptyAnalytics();
  }
}

export function getTopicAnalytics(topicId: string) {
  const analytics = getQuizAnalytics();
  const topicAttempts = analytics.attempts.filter((a) => a.topicId === topicId);

  return {
    attempts: topicAttempts,
    totalAttempts: topicAttempts.length,
    averageScore: calculateAverageScore(topicAttempts),
    bestScore:
      topicAttempts.length > 0
        ? Math.max(...topicAttempts.map((a) => a.percentage))
        : 0,
    improvement: calculateImprovement(topicAttempts),
  };
}

export function clearAnalytics(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Helper functions
function getEmptyAnalytics(): QuizAnalytics {
  return {
    attempts: [],
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    topicStats: {},
  };
}

function calculateAverageScore(attempts: QuizAttempt[]): number {
  if (attempts.length === 0) return 0;
  const sum = attempts.reduce((acc, a) => acc + a.percentage, 0);
  return Math.round(sum / attempts.length);
}

function updateTopicStats(
  analytics: QuizAnalytics,
  attempt: QuizAttempt
): void {
  if (!analytics.topicStats[attempt.topicId]) {
    analytics.topicStats[attempt.topicId] = {
      attempts: 0,
      averageScore: 0,
      bestScore: 0,
    };
  }

  const topicAttempts = analytics.attempts.filter(
    (a) => a.topicId === attempt.topicId
  );
  analytics.topicStats[attempt.topicId] = {
    attempts: topicAttempts.length,
    averageScore: calculateAverageScore(topicAttempts),
    bestScore: Math.max(...topicAttempts.map((a) => a.percentage)),
  };
}

function calculateImprovement(attempts: QuizAttempt[]): number {
  if (attempts.length < 2) return 0;

  const sorted = [...attempts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const first = sorted[0].percentage;
  const last = sorted[sorted.length - 1].percentage;

  return last - first;
}
