import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topicId = searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json({ error: "Missing topicId" }, { status: 400 });
    }

    const quizDir = join(
      process.cwd(),
      "public",
      "saved-content",
      "quizzes",
      topicId
    );

    try {
      const files = await readdir(quizDir);
      const quizFiles = files.filter(
        (f) => f.startsWith("quiz-") && f.endsWith(".json")
      );

      const quizzes = await Promise.all(
        quizFiles.map(async (file) => {
          const content = await readFile(join(quizDir, file), "utf-8");
          const quiz = JSON.parse(content);
          return {
            filename: file,
            version:
              quiz.metadata?.version ||
              parseInt(file.match(/quiz-(\d+)/)?.[1] || "1"),
            createdAt: quiz.metadata?.createdAt || null,
            questionCount: quiz.questions?.length || 0,
          };
        })
      );

      // Sort by version descending (newest first)
      quizzes.sort((a, b) => b.version - a.version);

      return NextResponse.json({ quizzes });
    } catch {
      // Directory doesn't exist or no quizzes
      return NextResponse.json({ quizzes: [] });
    }
  } catch (error) {
    console.error("Error listing quizzes:", error);
    return NextResponse.json(
      { error: "Failed to list quizzes" },
      { status: 500 }
    );
  }
}
