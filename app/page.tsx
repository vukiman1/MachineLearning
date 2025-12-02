"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ContentDisplay } from "@/components/content-display"
import { Header } from "@/components/header"

export type Topic = {
  id: string
  title: string
  icon: string
  prompt: string
}

export const topics: Topic[] = [
  {
    id: "what-is-ml",
    title: "Machine Learning là gì?",
    icon: "info",
    prompt:
      "Giải thích chi tiết Machine Learning là gì, bao gồm: định nghĩa, lịch sử phát triển, tại sao nó quan trọng, các ứng dụng thực tế. Hãy viết bằng tiếng Việt, trình bày rõ ràng với các heading, bullet points, và ví dụ minh họa cụ thể.",
  },
  {
    id: "ml-vs-ai-dl",
    title: "ML vs AI vs Deep Learning",
    icon: "layers",
    prompt:
      "So sánh chi tiết Machine Learning, Artificial Intelligence và Deep Learning: định nghĩa từng khái niệm, sự khác biệt, mối quan hệ, ưu nhược điểm, khi nào sử dụng cái nào. Viết bằng tiếng Việt với bảng so sánh và ví dụ thực tế.",
  },
  {
    id: "ml-pipeline",
    title: "ML Pipeline",
    icon: "account_tree",
    prompt:
      "Giải thích chi tiết ML Pipeline (quy trình Machine Learning) từ đầu đến cuối: thu thập dữ liệu, tiền xử lý, feature engineering, chia train/test, huấn luyện model, đánh giá, triển khai và monitoring. Viết bằng tiếng Việt với sơ đồ mô tả và best practices.",
  },
  {
    id: "terminology",
    title: "Thuật ngữ quan trọng",
    icon: "key",
    prompt:
      "Liệt kê và giải thích chi tiết 20+ thuật ngữ quan trọng nhất trong Machine Learning: Model, Features, Labels, Training/Test Set, Loss Function, Gradient Descent, Hyperparameters, Overfitting, Underfitting, Regularization, Cross-validation, v.v. Viết bằng tiếng Việt với ví dụ cho từng thuật ngữ.",
  },
  {
    id: "learning-types",
    title: "Các loại học máy",
    icon: "category",
    prompt:
      "Giải thích chi tiết các loại Machine Learning: Supervised Learning (Classification, Regression), Unsupervised Learning (Clustering, Dimensionality Reduction), Semi-supervised Learning, Reinforcement Learning. Viết bằng tiếng Việt với ví dụ ứng dụng thực tế cho từng loại.",
  },
  {
    id: "supervised-learning",
    title: "Supervised Learning",
    icon: "school",
    prompt:
      "Hướng dẫn chi tiết về Supervised Learning: định nghĩa, cách hoạt động, các thuật toán phổ biến (Linear Regression, Logistic Regression, Decision Trees, Random Forest, SVM, KNN), ưu nhược điểm, các bước thực hiện, metrics đánh giá. Viết bằng tiếng Việt với code examples.",
  },
  {
    id: "unsupervised-learning",
    title: "Unsupervised Learning",
    icon: "explore",
    prompt:
      "Hướng dẫn chi tiết về Unsupervised Learning: định nghĩa, các thuật toán (K-Means, Hierarchical Clustering, DBSCAN, PCA, t-SNE), ứng dụng thực tế (customer segmentation, anomaly detection), cách đánh giá. Viết bằng tiếng Việt với ví dụ code.",
  },
  {
    id: "neural-networks",
    title: "Neural Networks cơ bản",
    icon: "hub",
    prompt:
      "Giải thích chi tiết Neural Networks: cấu trúc (neurons, layers, weights, biases), activation functions, forward propagation, backpropagation, gradient descent, các loại neural networks (MLP, CNN, RNN). Viết bằng tiếng Việt với hình minh họa và công thức toán học.",
  },
  {
    id: "overfitting",
    title: "Overfitting & Underfitting",
    icon: "show_chart",
    prompt:
      "Giải thích chi tiết về Overfitting và Underfitting trong Machine Learning: nguyên nhân, cách nhận biết, các kỹ thuật khắc phục (regularization, dropout, early stopping, data augmentation, cross-validation). Viết bằng tiếng Việt với đồ thị minh họa và ví dụ code.",
  },
  {
    id: "model-evaluation",
    title: "Đánh giá Model",
    icon: "analytics",
    prompt:
      "Hướng dẫn chi tiết các phương pháp đánh giá ML Model: Accuracy, Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix, MSE, RMSE, MAE, R-squared, Cross-validation. Viết bằng tiếng Việt với công thức, cách tính và khi nào sử dụng metric nào.",
  },
  {
    id: "feature-engineering",
    title: "Feature Engineering",
    icon: "build",
    prompt:
      "Hướng dẫn chi tiết Feature Engineering: tầm quan trọng, các kỹ thuật (handling missing values, encoding categorical variables, scaling, normalization, feature selection, feature extraction, polynomial features). Viết bằng tiếng Việt với code examples Python/Pandas.",
  },
  {
    id: "practical-project",
    title: "Dự án thực hành",
    icon: "code",
    prompt:
      "Hướng dẫn chi tiết cách xây dựng một dự án ML hoàn chỉnh từ đầu: chọn bài toán, thu thập dữ liệu, EDA, preprocessing, model selection, training, tuning hyperparameters, deployment. Viết bằng tiếng Việt với code Python đầy đủ có thể chạy được.",
  },
]

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar topics={topics} selectedTopic={selectedTopic} onSelectTopic={setSelectedTopic} />
        <main className="ml-72 flex-1 p-8">
          <ContentDisplay selectedTopic={selectedTopic} />
        </main>
      </div>
    </div>
  )
}
