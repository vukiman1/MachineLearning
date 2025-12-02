"use client";

import { motion } from "framer-motion";

interface Node {
  id: string;
  label: string;
  value?: string;
  children?: Node[];
  isLeaf?: boolean;
}

const sampleTree: Node = {
  id: "root",
  label: "Outlook",
  children: [
    {
      id: "sunny",
      label: "Sunny",
      children: [
        {
          id: "sunny-high",
          label: "Humidity > 75%",
          children: [
            { id: "no1", label: "No", isLeaf: true, value: "Don't Play" },
            { id: "yes1", label: "Yes", isLeaf: true, value: "Play" },
          ],
        },
      ],
    },
    {
      id: "overcast",
      label: "Overcast",
      isLeaf: true,
      value: "Play",
    },
    {
      id: "rainy",
      label: "Rainy",
      children: [
        {
          id: "rainy-wind",
          label: "Windy?",
          children: [
            { id: "no2", label: "No", isLeaf: true, value: "Play" },
            { id: "yes2", label: "Yes", isLeaf: true, value: "Don't Play" },
          ],
        },
      ],
    },
  ],
};

function TreeNode({ node, level = 0 }: { node: Node; level?: number }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: level * 0.1 }}
        className={`px-4 py-2 rounded-lg border-2 ${
          node.isLeaf
            ? "bg-green-100 dark:bg-green-900/30 border-green-500"
            : "bg-blue-100 dark:bg-blue-900/30 border-blue-500"
        } shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
      >
        <div className="text-sm font-semibold text-gray-900 dark:text-white">
          {node.label}
        </div>
        {node.value && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            → {node.value}
          </div>
        )}
      </motion.div>

      {node.children && node.children.length > 0 && (
        <div className="flex gap-8 mt-8">
          {node.children.map((child) => (
            <div key={child.id} className="flex flex-col items-center">
              <div className="h-8 w-0.5 bg-gray-400 dark:bg-gray-600" />
              <TreeNode node={child} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DecisionTreeViz() {
  return (
    <div className="w-full overflow-x-auto p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Decision Tree Example
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A simple decision tree for predicting whether to play tennis based on
          weather conditions.
        </p>
      </div>
      <div className="min-w-max">
        <TreeNode node={sampleTree} />
      </div>
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          How it works:
        </h4>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>• Blue nodes are decision nodes (split on features)</li>
          <li>• Green nodes are leaf nodes (final predictions)</li>
          <li>• Follow the path from root to leaf to make a prediction</li>
        </ul>
      </div>
    </div>
  );
}
