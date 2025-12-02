"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // Initialize mermaid with custom theme
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      themeVariables: {
        primaryColor: "#3b82f6",
        primaryTextColor: "#fff",
        primaryBorderColor: "#2563eb",
        lineColor: "#64748b",
        secondaryColor: "#f1f5f9",
        tertiaryColor: "#e0f2fe",
        fontSize: "16px",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
        padding: 15,
      },
    });

    if (ref.current) {
      // Generate unique ID for each diagram
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      ref.current.innerHTML = `<div class="mermaid" id="${id}">${chart}</div>`;

      // Render the diagram
      mermaid.contentLoaded();
    }
  }, [chart]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
  };

  return (
    <div className="my-6 rounded-xl border-2 border-blue-300 dark:border-gray-600 overflow-hidden shadow-lg bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-gray-900/50 border-b border-blue-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sơ đồ ML Pipeline
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors"
            title="Thu nhỏ"
          >
            <ZoomOut className="size-4 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors"
            title="Đặt lại"
          >
            <Maximize2 className="size-4 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors"
            title="Phóng to"
          >
            <ZoomIn className="size-4 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Diagram Container */}
      <div className="p-6 overflow-auto">
        <div
          ref={ref}
          className="flex justify-center items-center min-h-[300px] transition-transform duration-200"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center top",
          }}
        />
      </div>
    </div>
  );
}
