import { NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyCZsektG8lM9d6Fn5Kliq1LbAuBdmpFI2g"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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
                  text: `Bạn là một giảng viên Machine Learning chuyên nghiệp. Hãy tạo nội dung học tập chi tiết, dễ hiểu cho sinh viên.

${prompt}

Yêu cầu format:
- Sử dụng Markdown để format nội dung
- Sử dụng headings (##, ###) để chia section rõ ràng
- Sử dụng bullet points và numbered lists khi cần
- Thêm code examples với syntax highlighting (python)
- Thêm bảng so sánh khi phù hợp
- Giải thích công thức toán học nếu có
- Viết hoàn toàn bằng tiếng Việt
- Nội dung phải chi tiết, đầy đủ, ít nhất 1000 từ`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API Error:", errorData)
      return NextResponse.json({ error: "Failed to generate content" }, { status: response.status })
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
