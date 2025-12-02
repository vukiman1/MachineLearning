import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const { topicId, content } = await request.json();

    if (!topicId || !content) {
      return NextResponse.json(
        { error: "Missing topicId or content" },
        { status: 400 }
      );
    }

    // Save to public/saved-content directory
    const filePath = join(
      process.cwd(),
      "public",
      "saved-content",
      `${topicId}.txt`
    );
    await writeFile(filePath, content, "utf-8");

    return NextResponse.json({
      success: true,
      message: "Content saved successfully",
    });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
