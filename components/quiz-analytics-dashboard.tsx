"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, TrendingUp, Trophy, Target, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getQuizAnalytics, QuizAttempt } from "@/lib/quiz-analytics";

interface QuizAnalyticsDashboardProps {
  onClose: () => void;
}

export function QuizAnalyticsDashboard({
  onClose,
}: QuizAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState(getQuizAnalytics());

  useEffect(() => {
    setAnalytics(getQuizAnalytics());
  }, []);

  // Prepare data for charts
  const scoreOverTime = analytics.attempts
    .slice(-10) // Last 10 attempts
    .map((attempt, index) => ({
      name: `Quiz ${index + 1}`,
      score: attempt.percentage,
      date: new Date(attempt.timestamp).toLocaleDateString("vi-VN"),
    }));

  const topicPerformance = Object.entries(analytics.topicStats).map(
    ([topicId, stats]) => ({
      topic: topicId.replace(/-/g, " ").slice(0, 20),
      average: stats.averageScore,
      best: stats.bestScore,
      attempts: stats.attempts,
    })
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BarChart3 className="size-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quiz Analytics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="size-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="size-5" />
                <div className="text-sm opacity-90">Total Quizzes</div>
              </div>
              <div className="text-3xl font-bold">
                {analytics.totalAttempts}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-linear-to-br from-green-500 to-green-600 rounded-lg text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="size-5" />
                <div className="text-sm opacity-90">Best Score</div>
              </div>
              <div className="text-3xl font-bold">{analytics.bestScore}%</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="size-5" />
                <div className="text-sm opacity-90">Average Score</div>
              </div>
              <div className="text-3xl font-bold">
                {analytics.averageScore}%
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-5" />
                <div className="text-sm opacity-90">Topics Covered</div>
              </div>
              <div className="text-3xl font-bold">
                {Object.keys(analytics.topicStats).length}
              </div>
            </motion.div>
          </div>

          {analytics.totalAttempts === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Chưa có dữ liệu quiz. Hãy làm quiz để xem analytics!
              </p>
            </div>
          ) : (
            <>
              {/* Score Over Time Chart */}
              {scoreOverTime.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Score Over Time (Last 10 Quizzes)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={scoreOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Score (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {/* Topic Performance Chart */}
              {topicPerformance.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Performance by Topic
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topicPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topic" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="average"
                        fill="#8b5cf6"
                        name="Average (%)"
                      />
                      <Bar dataKey="best" fill="#10b981" name="Best (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {/* Recent Attempts */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Attempts
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analytics.attempts
                    .slice(-5)
                    .reverse()
                    .map((attempt, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {attempt.topicTitle}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(attempt.timestamp).toLocaleString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            attempt.percentage >= 80
                              ? "text-green-600"
                              : attempt.percentage >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {attempt.percentage}%
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
