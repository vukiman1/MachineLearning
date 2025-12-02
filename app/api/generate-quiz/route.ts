import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, readdir, mkdir } from "fs/promises";
import { join } from "path";

const GEMINI_API_KEY = "AIzaSyCZsektG8lM9d6Fn5Kliq1LbAuBdmpFI2g";

export async function POST(request: NextRequest) {
  try {
    const { topicId, content, forceNew } = await request.json();

    if (!topicId || !content) {
      return NextResponse.json(
        { error: "Missing topicId or content" },
        { status: 400 }
      );
    }

    const quizDir = join(
      process.cwd(),
      "public",
      "saved-content",
      "quizzes",
      topicId
    );

    // If not forcing new quiz, return the latest existing quiz
    if (!forceNew) {
      try {
        const files = await readdir(quizDir);
        const quizFiles = files.filter(
          (f) => f.startsWith("quiz-") && f.endsWith(".json")
        );

        if (quizFiles.length > 0) {
          // Sort by version number and get the latest
          quizFiles.sort((a, b) => {
            const aNum = parseInt(a.match(/quiz-(\d+)/)?.[1] || "0");
            const bNum = parseInt(b.match(/quiz-(\d+)/)?.[1] || "0");
            return bNum - aNum;
          });

          const latestQuiz = await readFile(
            join(quizDir, quizFiles[0]),
            "utf-8"
          );
          return NextResponse.json(JSON.parse(latestQuiz));
        }
      } catch {
        // Directory doesn't exist or no quizzes yet
      }
    }

    // Generate new quiz using Gemini API
    const prompt = `Dựa trên nội dung sau về Machine Learning, hãy tạo 8 câu hỏi trắc nghiệm chất lượng cao bằng tiếng Việt.

Nội dung:
${content.substring(0, 3000)}

Yêu cầu:
- Tạo 8 câu hỏi trắc nghiệm KHÁC BIỆT với các quiz trước (nếu có)
- Mỗi câu có 4 đáp án (A, B, C, D)
- Câu hỏi phải liên quan trực tiếp đến nội dung
- Độ khó từ dễ đến khó
- Giải thích chi tiết tại sao đáp án đúng và các đáp án khác sai

Trả về JSON theo format sau (KHÔNG thêm markdown, chỉ JSON thuần):
{
  "questions": [
    {
      "question": "Câu hỏi?",
      "options": ["A. Đáp án A", "B. Đáp án B", "C. Đáp án C", "D. Đáp án D"],
      "correctAnswer": 0,
      "explanation": "Giải thích chi tiết tại sao đáp án đúng và các đáp án khác sai"
    }
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate quiz from Gemini API");
    }

    const data = await response.json();
    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean response and parse JSON
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    }

    const quizData = JSON.parse(cleanedResponse);

    // Determine next version number
    let version = 1;
    try {
      const files = await readdir(quizDir);
      const quizFiles = files.filter(
        (f) => f.startsWith("quiz-") && f.endsWith(".json")
      );
      if (quizFiles.length > 0) {
        const versions = quizFiles.map((f) =>
          parseInt(f.match(/quiz-(\d+)/)?.[1] || "0")
        );
        version = Math.max(...versions) + 1;
      }
    } catch {
      // Directory doesn't exist, create it
      try {
        await mkdir(quizDir, { recursive: true });
      } catch (err) {
        console.error("Error creating quiz directory:", err);
      }
    }

    // Add metadata
    const quizWithMetadata = {
      ...quizData,
      metadata: {
        version,
        topicId,
        createdAt: new Date().toISOString(),
      },
    };

    // Save quiz with version number
    const quizPath = join(quizDir, `quiz-${version}.json`);
    await writeFile(
      quizPath,
      JSON.stringify(quizWithMetadata, null, 2),
      "utf-8"
    );

    return NextResponse.json(quizWithMetadata);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
