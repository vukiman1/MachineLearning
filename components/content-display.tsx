"use client";

import { useState, useEffect } from "react";
import type { Topic } from "@/app/page";
import {
  Loader2,
  BookOpen,
  Sparkles,
  RefreshCw,
  FileQuestion,
} from "lucide-react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MermaidDiagram } from "./mermaid-diagram";
import { CodeBlock } from "./code-block";
import { QuizGenerator } from "./quiz-generator";

interface ContentDisplayProps {
  selectedTopic: Topic | null;
  showQuiz: boolean;
  onOpenQuiz: () => void;
  onCloseQuiz: () => void;
  onShowVisualization: () => void;
}

export function ContentDisplay({
  selectedTopic,
  showQuiz,
  onOpenQuiz,
  onCloseQuiz,
  onShowVisualization,
}: ContentDisplayProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Function to save content to file
  const saveContent = async (topicId: string, contentToSave: string) => {
    try {
      await fetch("/api/save-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicId, content: contentToSave }),
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Error saving content:", err);
    }
  };

  // Function to load saved content
  const loadSavedContent = async (topicId: string) => {
    try {
      const response = await fetch(`/api/load-content?topicId=${topicId}`);
      const data = await response.json();
      return data.content;
    } catch (err) {
      console.error("Error loading saved content:", err);
      return null;
    }
  };

  const generateContent = async (forceRegenerate = false) => {
    if (!selectedTopic) return;

    setIsLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      // Try to load saved content first if not forcing regenerate
      if (!forceRegenerate) {
        const savedContent = await loadSavedContent(selectedTopic.id);
        if (savedContent) {
          setContent(savedContent);
          setIsSaved(true);
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: selectedTopic.prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setContent(data.content);

      // Auto-save generated content
      await saveContent(selectedTopic.id, data.content);
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTopic) {
      generateContent();
    } else {
      setContent("");
    }
  }, [selectedTopic]);

  const handleReload = () => {
    generateContent(true);
  };

  if (!selectedTopic) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <BookOpen className="mb-4 size-16 text-gray-300" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Chào mừng đến với ML Learning Hub
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Chọn một chủ đề từ menu bên trái để bắt đầu học.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Machine Learning</span>
            <span>/</span>
            <span>Topics</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {selectedTopic.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isSaved && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
              <Sparkles className="size-4" />
              <span>Đã lưu</span>
            </div>
          )}

          <button
            onClick={onShowVisualization}
            disabled={isLoading || !content}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg font-medium transition-colors disabled:opacity-50"
            title="Visualize Concepts"
          >
            <Sparkles className="size-4" />
            Visualize
          </button>

          <button
            onClick={onOpenQuiz}
            disabled={isLoading || !content}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <FileQuestion className="size-4" />
            Làm Quiz
          </button>

          <button
            onClick={handleReload}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Tạo lại nội dung"
          >
            <RefreshCw
              className={`size-5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-4 size-8 animate-spin text-blue-600" />
              <p className="text-gray-500">Đang tạo nội dung bài học...</p>
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match) {
                    if (match[1] === "mermaid") {
                      return (
                        <MermaidDiagram
                          chart={String(children).replace(/\n$/, "")}
                        />
                      );
                    }
                    return (
                      <CodeBlock language={match[1]}>
                        {String(children).replace(/\n$/, "")}
                      </CodeBlock>
                    );
                  }
                  return (
                    <code
                      className={`${className} bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:text-pink-400`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 dark:text-gray-300">
                    {children}
                  </td>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/10 py-2 pr-2 rounded-r">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="pl-1">{children}</li>,
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && selectedTopic && (
        <QuizGenerator
          topicId={selectedTopic.id}
          topicTitle={selectedTopic.title}
          content={content}
          onClose={onCloseQuiz}
        />
      )}
    </div>
  );
}
