"use client";

import { useState, useEffect } from "react";
import type { Topic } from "@/app/page";
import { Loader2, BookOpen, Sparkles, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MermaidDiagram } from "./mermaid-diagram";
import { CodeBlock } from "./code-block";

interface ContentDisplayProps {
  selectedTopic: Topic | null;
}

export function ContentDisplay({ selectedTopic }: ContentDisplayProps) {
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
      console.error("Error loading content:", err);
      return null;
    }
  };

  // Function to generate new content
  const generateContent = async (forceRegenerate = false) => {
    if (!selectedTopic) return;

    setIsLoading(true);
    setError(null);
    setContent("");

    try {
      // Check for saved content first (unless forcing regenerate)
      if (!forceRegenerate) {
        const savedContent = await loadSavedContent(selectedTopic.id);
        if (savedContent) {
          setContent(savedContent);
          setIsSaved(true);
          setIsLoading(false);
          return;
        }
      }

      // Generate new content from API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: selectedTopic.prompt }),
      });

      if (!response.ok) {
        throw new Error("Không thể tải nội dung. Vui lòng thử lại.");
      }

      const data = await response.json();
      setContent(data.content);

      // Save content to file
      await saveContent(selectedTopic.id, data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTopic) {
      setContent("");
      setIsSaved(false);
      return;
    }

    generateContent();
  }, [selectedTopic]);

  const handleReload = () => {
    generateContent(true);
  };

  if (!selectedTopic) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="size-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
            <BookOpen className="size-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            Chào mừng đến với ML Learning Hub
          </h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Chọn một chủ đề từ sidebar để bắt đầu học Machine Learning. Nội dung
            sẽ được tạo bởi AI Gemini với giải thích chi tiết và ví dụ thực tế.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            <div className="p-4 rounded-xl bg-muted/50 text-left">
              <Sparkles className="size-5 text-blue-600 mb-2" />
              <h3 className="font-semibold text-sm mb-1">Nội dung AI</h3>
              <p className="text-xs text-muted-foreground">
                Được tạo bởi Gemini API với nội dung chi tiết
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-left">
              <BookOpen className="size-5 text-blue-600 mb-2" />
              <h3 className="font-semibold text-sm mb-1">12+ Chủ đề</h3>
              <p className="text-xs text-muted-foreground">
                Từ cơ bản đến nâng cao về ML
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-left">
              <svg
                className="size-5 text-blue-600 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <h3 className="font-semibold text-sm mb-1">Ví dụ Code</h3>
              <p className="text-xs text-muted-foreground">
                Kèm theo code Python thực hành
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <a href="#" className="hover:text-foreground">
            Trang chủ
          </a>
          <span>/</span>
          <a href="#" className="hover:text-foreground">
            Intro to ML
          </a>
          <span>/</span>
          <span className="text-foreground">{selectedTopic.title}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedTopic.title}
          </h1>
          <div className="flex items-center gap-3">
            {isSaved && !isLoading && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Đã lưu
              </span>
            )}
            <button
              onClick={handleReload}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium transition-colors"
              title="Tạo lại nội dung"
            >
              <RefreshCw
                className={`size-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Reload
            </button>
          </div>
        </div>
        <p className="text-muted-foreground">Nội dung được tạo bởi Gemini AI</p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-10 text-blue-600 animate-spin mb-4" />
          <p className="text-muted-foreground">Đang tạo nội dung học tập...</p>
          <p className="text-sm text-muted-foreground mt-1">
            Gemini đang phân tích và viết nội dung chi tiết
          </p>
        </div>
      )}

      {error && (
        <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-destructive font-medium">Lỗi: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-destructive underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {content && !isLoading && (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mt-6 mb-4 first:mt-0 text-foreground">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mt-6 mb-3 text-blue-600">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed text-foreground/90">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-foreground/90">{children}</li>
                ),
                code: ({ className, children }) => {
                  const isInline = !className;
                  const language = className?.replace("language-", "") || "";
                  const code = String(children).replace(/\n$/, "");

                  // Check if it's a Mermaid diagram
                  if (language === "mermaid") {
                    return <MermaidDiagram chart={code} />;
                  }

                  // Inline code
                  if (isInline) {
                    return (
                      <code className="bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-sm font-mono text-blue-700 dark:text-blue-300">
                        {children}
                      </code>
                    );
                  }

                  // Code block with syntax highlighting
                  return <CodeBlock language={language}>{code}</CodeBlock>;
                },
                pre: ({ children }) => (
                  <pre className="code-block rounded-lg overflow-hidden mb-4">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-600 pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2">{children}</td>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
                hr: () => <hr className="my-6 border-border" />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
