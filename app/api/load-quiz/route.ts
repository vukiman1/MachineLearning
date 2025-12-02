import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topicId = searchParams.get("topicId");
    const version = searchParams.get("version");

    if (!topicId || !version) {
      return NextResponse.json(
        { error: "Missing topicId or version" },
        { status: 400 }
      );
    }

    const quizPath = join(
      process.cwd(),
      "public",
      "saved-content",
      "quizzes",
      topicId,
      `quiz-${version}.json`
    );

    try {
      const quizContent = await readFile(quizPath, "utf-8");
      return NextResponse.json(JSON.parse(quizContent));
    } catch {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error loading quiz:", error);
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 });
  }
}
