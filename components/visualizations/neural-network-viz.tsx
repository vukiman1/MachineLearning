"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Layer {
  name: string;
  neurons: number;
  color: string;
}

const defaultLayers: Layer[] = [
  { name: "Input", neurons: 4, color: "bg-blue-500" },
  { name: "Hidden 1", neurons: 6, color: "bg-purple-500" },
  { name: "Hidden 2", neurons: 4, color: "bg-purple-500" },
  { name: "Output", neurons: 3, color: "bg-green-500" },
];

export function NeuralNetworkViz() {
  const [hoveredNeuron, setHoveredNeuron] = useState<string | null>(null);
  const [layers] = useState(defaultLayers);

  return (
    <div className="w-full p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Neural Network Architecture
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A simple feedforward neural network with 2 hidden layers. Hover over
          neurons to see connections.
        </p>
      </div>

      <div className="flex justify-around items-center min-h-[400px] relative">
        {layers.map((layer, layerIdx) => (
          <div key={layer.name} className="flex flex-col items-center gap-4">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {layer.name}
            </div>
            <div className="flex flex-col gap-6">
              {Array.from({ length: layer.neurons }).map((_, neuronIdx) => {
                const neuronId = `${layerIdx}-${neuronIdx}`;
                const isHovered = hoveredNeuron === neuronId;

                return (
                  <motion.div
                    key={neuronId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: layerIdx * 0.1 + neuronIdx * 0.05 }}
                    whileHover={{ scale: 1.3 }}
                    onHoverStart={() => setHoveredNeuron(neuronId)}
                    onHoverEnd={() => setHoveredNeuron(null)}
                    className={`w-12 h-12 rounded-full ${
                      layer.color
                    } shadow-lg cursor-pointer flex items-center justify-center text-white font-bold text-xs transition-all ${
                      isHovered ? "ring-4 ring-yellow-400" : ""
                    }`}
                  >
                    {neuronIdx + 1}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
          {layers.slice(0, -1).map((layer, layerIdx) => {
            const nextLayer = layers[layerIdx + 1];
            const x1 = ((layerIdx + 1) / layers.length) * 100;
            const x2 = ((layerIdx + 2) / layers.length) * 100;

            return Array.from({ length: layer.neurons }).flatMap((_, i) =>
              Array.from({ length: nextLayer.neurons }).map((_, j) => {
                const y1 = ((i + 1) / (layer.neurons + 1)) * 100;
                const y2 = ((j + 1) / (nextLayer.neurons + 1)) * 100;

                return (
                  <line
                    key={`${layerIdx}-${i}-${j}`}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-gray-300 dark:text-gray-600 opacity-30"
                  />
                );
              })
            );
          })}
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Network Info:
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Total layers: {layers.length}</li>
            <li>
              • Total neurons: {layers.reduce((sum, l) => sum + l.neurons, 0)}
            </li>
            <li>• Activation: ReLU (hidden), Softmax (output)</li>
          </ul>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            How it works:
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Data flows from left to right</li>
            <li>• Each neuron connects to all neurons in next layer</li>
            <li>• Hover over neurons to highlight them</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
