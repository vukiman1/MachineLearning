"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { DecisionTreeViz } from "./visualizations/decision-tree-viz";
import { NeuralNetworkViz } from "./visualizations/neural-network-viz";
import { ConfusionMatrixViz } from "./visualizations/confusion-matrix-viz";

interface VisualizationModalProps {
  onClose: () => void;
}

export function VisualizationModal({ onClose }: VisualizationModalProps) {
  const [activeTab, setActiveTab] = useState<"tree" | "network" | "matrix">(
    "tree"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const tabs = [
    { id: "tree" as const, label: "Decision Tree", component: DecisionTreeViz },
    {
      id: "network" as const,
      label: "Neural Network",
      component: NeuralNetworkViz,
    },
    {
      id: "matrix" as const,
      label: "Confusion Matrix",
      component: ConfusionMatrixViz,
    },
  ];

  const ActiveComponent =
    tabs.find((t) => t.id === activeTab)?.component || DecisionTreeViz;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden ${
            isFullscreen ? "w-full h-full" : "max-w-6xl w-full max-h-[90vh]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎨 Interactive Visualizations
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="size-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Maximize2 className="size-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Close"
              >
                <X className="size-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: isFullscreen
                ? "calc(100vh - 140px)"
                : "calc(90vh - 140px)",
            }}
          >
            <ActiveComponent />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
