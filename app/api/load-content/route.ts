import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topicId = searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json({ error: "Missing topicId" }, { status: 400 });
    }

    // Load from public/saved-content directory
    const filePath = join(
      process.cwd(),
      "public",
      "saved-content",
      `${topicId}.txt`
    );

    try {
      const content = await readFile(filePath, "utf-8");
      return NextResponse.json({ content });
    } catch (error) {
      // File doesn't exist, return null
      return NextResponse.json({ content: null });
    }
  } catch (error) {
    console.error("Error loading content:", error);
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 }
    );
  }
}
