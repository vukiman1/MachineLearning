"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  FileQuestion,
  Share2,
  Moon,
  Sun,
  X,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";

interface FloatingActionButtonProps {
  onQuizClick?: () => void;
  selectedTopicTitle?: string;
}

export function FloatingActionButton({
  onQuizClick,
  selectedTopicTitle,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = async () => {
    if (navigator.share && selectedTopicTitle) {
      try {
        await navigator.share({
          title: `ML Learning Hub - ${selectedTopicTitle}`,
          text: `Check out this ML topic: ${selectedTopicTitle}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  const actions = [
    {
      icon: theme === "dark" ? Sun : Moon,
      label: theme === "dark" ? "Light Mode" : "Dark Mode",
      onClick: toggleTheme,
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      icon: FileQuestion,
      label: "Quick Quiz",
      onClick: onQuizClick,
      color: "bg-green-500 hover:bg-green-600",
      disabled: !onQuizClick,
    },
    {
      icon: Share2,
      label: "Share",
      onClick: handleShare,
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <>
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  action.onClick?.();
                  setIsExpanded(false);
                }}
                disabled={action.disabled}
                className={`${action.color} disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 group`}
                title={action.label}
              >
                <action.icon className="size-5" />
                <span className="text-sm font-medium max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && !isExpanded && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={scrollToTop}
            className="bg-gray-700 dark:bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors"
            title="Scroll to top"
          >
            <ChevronUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${
          isExpanded
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white p-4 rounded-full shadow-lg transition-all duration-200`}
        title={isExpanded ? "Close menu" : "Open menu"}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? <X className="size-6" /> : <Menu className="size-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
