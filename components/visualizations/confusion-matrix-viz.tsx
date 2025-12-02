"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ConfusionMatrixData {
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
}

const sampleData: ConfusionMatrixData = {
  truePositive: 85,
  falsePositive: 10,
  falseNegative: 15,
  trueNegative: 90,
};

export function ConfusionMatrixViz() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const total =
    sampleData.truePositive +
    sampleData.falsePositive +
    sampleData.falseNegative +
    sampleData.trueNegative;

  const accuracy =
    ((sampleData.truePositive + sampleData.trueNegative) / total) * 100;
  const precision =
    (sampleData.truePositive /
      (sampleData.truePositive + sampleData.falsePositive)) *
    100;
  const recall =
    (sampleData.truePositive /
      (sampleData.truePositive + sampleData.falseNegative)) *
    100;
  const f1Score = (2 * (precision * recall)) / (precision + recall);

  const cells = [
    {
      id: "tp",
      label: "True Positive",
      value: sampleData.truePositive,
      color: "bg-green-500",
      description: "Correctly predicted positive",
    },
    {
      id: "fp",
      label: "False Positive",
      value: sampleData.falsePositive,
      color: "bg-red-400",
      description: "Incorrectly predicted positive (Type I error)",
    },
    {
      id: "fn",
      label: "False Negative",
      value: sampleData.falseNegative,
      color: "bg-orange-400",
      description: "Incorrectly predicted negative (Type II error)",
    },
    {
      id: "tn",
      label: "True Negative",
      value: sampleData.trueNegative,
      color: "bg-green-500",
      description: "Correctly predicted negative",
    },
  ];

  return (
    <div className="w-full p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Confusion Matrix
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A confusion matrix showing model predictions vs actual values. Hover
          over cells for details.
        </p>
      </div>

      <div className="flex flex-col items-center">
        {/* Matrix */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {/* Header row */}
          <div />
          <div className="text-center font-semibold text-sm text-gray-700 dark:text-gray-300 p-2">
            Predicted Positive
          </div>
          <div className="text-center font-semibold text-sm text-gray-700 dark:text-gray-300 p-2">
            Predicted Negative
          </div>

          {/* First data row */}
          <div className="flex items-center justify-end font-semibold text-sm text-gray-700 dark:text-gray-300 p-2">
            Actual Positive
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredCell("tp")}
            onHoverEnd={() => setHoveredCell(null)}
            className={`${cells[0].color} text-white p-6 rounded-lg cursor-pointer shadow-lg flex flex-col items-center justify-center min-w-[120px] min-h-[120px]`}
          >
            <div className="text-3xl font-bold">{cells[0].value}</div>
            <div className="text-xs mt-1 opacity-90">{cells[0].label}</div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredCell("fn")}
            onHoverEnd={() => setHoveredCell(null)}
            className={`${cells[2].color} text-white p-6 rounded-lg cursor-pointer shadow-lg flex flex-col items-center justify-center min-w-[120px] min-h-[120px]`}
          >
            <div className="text-3xl font-bold">{cells[2].value}</div>
            <div className="text-xs mt-1 opacity-90">{cells[2].label}</div>
          </motion.div>

          {/* Second data row */}
          <div className="flex items-center justify-end font-semibold text-sm text-gray-700 dark:text-gray-300 p-2">
            Actual Negative
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredCell("fp")}
            onHoverEnd={() => setHoveredCell(null)}
            className={`${cells[1].color} text-white p-6 rounded-lg cursor-pointer shadow-lg flex flex-col items-center justify-center min-w-[120px] min-h-[120px]`}
          >
            <div className="text-3xl font-bold">{cells[1].value}</div>
            <div className="text-xs mt-1 opacity-90">{cells[1].label}</div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredCell("tn")}
            onHoverEnd={() => setHoveredCell(null)}
            className={`${cells[3].color} text-white p-6 rounded-lg cursor-pointer shadow-lg flex flex-col items-center justify-center min-w-[120px] min-h-[120px]`}
          >
            <div className="text-3xl font-bold">{cells[3].value}</div>
            <div className="text-xs mt-1 opacity-90">{cells[3].label}</div>
          </motion.div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {accuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Accuracy
            </div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {precision.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Precision
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {recall.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Recall
            </div>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {f1Score.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              F1 Score
            </div>
          </div>
        </div>

        {/* Description */}
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {cells.find((c) => c.id === hoveredCell)?.description}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
