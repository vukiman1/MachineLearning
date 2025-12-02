"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Plus,
  Clock,
  List,
} from "lucide-react";
import { saveQuizAttempt } from "@/lib/quiz-analytics";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizMetadata {
  version: number;
  topicId: string;
  createdAt: string;
}

interface QuizData {
  questions: QuizQuestion[];
  metadata?: QuizMetadata;
}

interface QuizListItem {
  filename: string;
  version: number;
  createdAt: string | null;
  questionCount: number;
}

interface QuizGeneratorProps {
  topicId: string;
  topicTitle: string;
  content: string;
  onClose: () => void;
}

export function QuizGenerator({
  topicId,
  topicTitle,
  content,
  onClose,
}: QuizGeneratorProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizList, setQuizList] = useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Load quiz list on mount
  useEffect(() => {
    loadQuizList();
  }, [topicId]);

  const loadQuizList = async () => {
    setIsLoadingList(true);
    try {
      const response = await fetch(`/api/list-quizzes?topicId=${topicId}`);
      if (response.ok) {
        const data = await response.json();
        setQuizList(data.quizzes || []);

        // Auto-load latest quiz if exists
        if (data.quizzes && data.quizzes.length > 0 && !quizData) {
          await loadQuiz(data.quizzes[0].version);
        }
      }
    } catch (err) {
      console.error("Error loading quiz list:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const loadQuiz = async (version: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/load-quiz?topicId=${topicId}&version=${version}`
      );
      if (!response.ok) {
        throw new Error("Không thể tải quiz");
      }
      const data = await response.json();
      setQuizData(data);
      setSelectedAnswers(new Array(data.questions.length).fill(-1));
      setShowHistory(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewQuiz = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicId, content, forceNew: true }),
      });

      if (!response.ok) {
        throw new Error("Không thể tạo quiz");
      }

      const data = await response.json();
      setQuizData(data);
      setSelectedAnswers(new Array(data.questions.length).fill(-1));
      setShowHistory(false);

      // Reload quiz list to show new quiz
      await loadQuizList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!quizData) return;

    if (currentQuestion < quizData.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, 1000);
    } else {
      // Quiz finished, save analytics
      setTimeout(() => {
        setShowResults(true);

        // Calculate final score including the current answer
        const finalScore = selectedAnswers.reduce((acc, answer, index) => {
          return (
            acc + (answer === quizData.questions[index].correctAnswer ? 1 : 0)
          );
        }, 0);

        const percentage = Math.round(
          (finalScore / quizData.questions.length) * 100
        );

        saveQuizAttempt({
          topicId,
          topicTitle,
          quizVersion: quizData.metadata?.version || 1,
          score: finalScore,
          totalQuestions: quizData.questions.length,
          percentage,
          timestamp: new Date().toISOString(),
        });
      }, 1000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quizData?.questions.length || 0).fill(-1));
    setShowResults(false);
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let correct = 0;
    quizData.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Không rõ";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show quiz history list
  if (showHistory || (!quizData && !isLoadingList && quizList.length > 0)) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <List className="size-6" />
            Danh sách Quiz đã tạo
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Chọn một quiz để làm lại hoặc tạo quiz mới với câu hỏi khác biệt.
          </p>

          {/* Quiz List */}
          <div className="space-y-3 mb-6">
            {quizList.map((quiz) => (
              <button
                key={quiz.version}
                onClick={() => loadQuiz(quiz.version)}
                className="w-full p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-700 text-left transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Quiz #{quiz.version}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="size-4" />
                    {formatDate(quiz.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {quiz.questionCount} câu hỏi
                </p>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={generateNewQuiz}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Plus className="size-5" />
                  Tạo Quiz Mới
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show initial state (no quiz yet)
  if (!quizData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            📝 Kiểm tra kiến thức
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {isLoadingList
              ? "Đang tải danh sách quiz..."
              : "Chưa có quiz nào cho chủ đề này. Tạo quiz đầu tiên để bắt đầu!"}
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={generateNewQuiz}
              disabled={isLoading || isLoadingList}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Đang tạo quiz...
                </>
              ) : (
                "Tạo Quiz"
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];
  const score = calculateScore();
  const totalQuestions = quizData.questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Show results screen
  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-3xl w-full my-8">
          <div className="text-center mb-8">
            <Trophy className="size-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Kết quả Quiz
            </h2>
            {quizData.metadata && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Quiz #{quizData.metadata.version}
              </p>
            )}
            <p className="text-5xl font-bold text-blue-600 mb-2">
              {score}/{totalQuestions}
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Điểm: {percentage}%
            </p>
          </div>

          <div className="space-y-6 mb-6">
            {quizData.questions.map((q, i) => {
              const isCorrect = selectedAnswers[i] === q.correctAnswer;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                      : "bg-red-50 dark:bg-red-900/20 border-red-500"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle2 className="size-6 text-green-600 shrink-0 mt-1" />
                    ) : (
                      <XCircle className="size-6 text-red-600 shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">
                        Câu {i + 1}: {q.question}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Bạn chọn:</strong>{" "}
                        {q.options[selectedAnswers[i]] || "Chưa chọn"}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Đáp án đúng:</strong>{" "}
                        {q.options[q.correctAnswer]}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="size-5" />
              Làm lại
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <List className="size-5" />
              Xem danh sách
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show quiz questions
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
        {/* Header with Quiz Info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {quizData.metadata && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quiz #{quizData.metadata.version} •{" "}
                {formatDate(quizData.metadata.createdAt)}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <List className="size-4" />
            Danh sách quiz
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Câu {currentQuestion + 1} / {totalQuestions}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {selectedAnswers.filter((a) => a !== -1).length} /{" "}
              {totalQuestions} đã trả lời
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswerSelect(i)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswers[currentQuestion] === i
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
              }`}
            >
              <span className="text-gray-900 dark:text-white">{option}</span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            Câu trước
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            Đóng
          </button>

          {currentQuestion === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers.includes(-1)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Nộp bài
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Câu sau
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
