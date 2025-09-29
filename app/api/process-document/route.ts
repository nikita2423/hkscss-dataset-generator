import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { documentId, documentName, documentContent } = await request.json()

    // Step 1: Chunk the document
    const chunks = await chunkDocument(documentContent)

    // Step 2: Generate questions and answers for each chunk
    const qaResults = []

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]

      // Generate questions from the chunk
      const questions = await generateQuestionsFromChunk(chunk, i + 1)

      // Generate answers for each question
      for (const question of questions) {
        const answer = await generateAnswerFromChunk(question, chunk, i + 1)
        qaResults.push({
          id: `${documentId}-${i + 1}-${qaResults.length + 1}`,
          chunkId: i + 1,
          chunkText: chunk,
          question: question,
          answer: answer,
          status: "generated",
          isApproved: false,
        })
      }
    }

    // Store the results
    const documents = JSON.parse(global.localStorage?.getItem("documents") || "[]")
    const updatedDocs = documents.map((doc: any) =>
      doc.id === documentId
        ? {
            ...doc,
            status: "completed",
            chunks: chunks.map((chunk, index) => ({
              id: index + 1,
              text: chunk,
              wordCount: chunk.split(" ").length,
            })),
            questions: qaResults,
          }
        : doc,
    )

    return NextResponse.json({
      success: true,
      chunks: chunks.length,
      questions: qaResults.length,
      results: qaResults,
    })
  } catch (error) {
    console.error("Document processing error:", error)
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
  }
}

async function chunkDocument(content: string): Promise<string[]> {
  // Simple chunking strategy - split by paragraphs and combine into ~500 word chunks
  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0)
  const chunks: string[] = []
  let currentChunk = ""
  const targetWordsPerChunk = 500

  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ")
    const currentWords = currentChunk.split(" ").length

    if (currentWords + words.length > targetWordsPerChunk && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())
      currentChunk = paragraph
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }

  return chunks.length > 0 ? chunks : [content] // Fallback to full content if no chunks
}

async function generateQuestionsFromChunk(chunk: string, chunkId: number): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Based on the following text chunk, generate 2-3 specific, answerable questions that test comprehension of the key information. The questions should be clear, focused, and directly answerable from the content provided.

Text chunk:
${chunk}

Generate questions in this format:
1. [Question 1]
2. [Question 2]
3. [Question 3]

Focus on:
- Key facts and concepts
- Important details
- Main ideas
- Specific information that can be clearly answered

Questions:`,
      temperature: 0.7,
      maxTokens: 300,
    })

    // Parse the generated questions
    const questions = text
      .split("\n")
      .filter((line) => line.match(/^\d+\./))
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((q) => q.length > 0)

    return questions.length > 0 ? questions : [`What are the main points discussed in this section?`]
  } catch (error) {
    console.error("Question generation error:", error)
    return [`What information is provided in chunk ${chunkId}?`]
  }
}

async function generateAnswerFromChunk(question: string, chunk: string, chunkId: number): Promise<string> {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Based on the following text chunk, provide a comprehensive and accurate answer to the question. The answer should be directly based on the information in the text and be complete but concise.

Text chunk:
${chunk}

Question: ${question}

Provide a clear, factual answer based solely on the information in the text chunk:`,
      temperature: 0.3,
      maxTokens: 200,
    })

    return text.trim() || `Based on the provided text, this information relates to the content in chunk ${chunkId}.`
  } catch (error) {
    console.error("Answer generation error:", error)
    return `This answer is based on the content from chunk ${chunkId} of the document.`
  }
}
