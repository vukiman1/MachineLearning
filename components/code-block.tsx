"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  return (
    <div className="my-4 rounded-lg overflow-hidden shadow-md">
      <div className="bg-gray-800 px-4 py-2 text-xs font-mono text-gray-300 border-b border-gray-700">
        {language || "code"}
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          fontSize: "0.95rem",
          lineHeight: "1.6",
          borderRadius: "0 0 0.5rem 0.5rem",
        }}
        showLineNumbers={true}
        wrapLines={true}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
