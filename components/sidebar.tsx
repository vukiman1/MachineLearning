"use client"

import type { Topic } from "@/app/page"

interface SidebarProps {
  topics: Topic[]
  selectedTopic: Topic | null
  onSelectTopic: (topic: Topic) => void
}

export function Sidebar({ topics, selectedTopic, onSelectTopic }: SidebarProps) {
  return (
    <aside className="w-72 fixed top-16 left-0 h-[calc(100vh-64px)] overflow-y-auto border-r border-border bg-background">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg className="size-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold">Intro to ML</h1>
            <p className="text-sm text-muted-foreground">Chọn chủ đề để học</p>
          </div>
        </div>

        <div className="space-y-1">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                selectedTopic?.id === topic.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: selectedTopic?.id === topic.id ? "'FILL' 1" : "'FILL' 0" }}
              >
                {topic.icon}
              </span>
              <span className="text-sm font-medium">{topic.title}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
