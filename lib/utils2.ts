import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
}

export function generateDummyDocument() {
  const dummyChunks = [
    {
      id: "chunk-1",
      text: "Artificial Intelligence (AI) has revolutionized the way we approach problem-solving across various industries. From healthcare to finance, AI technologies are being implemented to automate processes, enhance decision-making, and provide insights that were previously impossible to obtain. Machine learning, a subset of AI, enables systems to learn and improve from experience without being explicitly programmed for every scenario.",
      wordCount: 58,
      questionCount: 3,
    },
    {
      id: "chunk-2",
      text: "Deep learning represents a significant advancement in machine learning, utilizing neural networks with multiple layers to process complex data patterns. These networks can analyze vast amounts of unstructured data, including images, text, and audio, to extract meaningful information. The architecture of deep neural networks mimics the human brain's structure, allowing for sophisticated pattern recognition and feature extraction.",
      wordCount: 52,
      questionCount: 2,
    },
    {
      id: "chunk-3",
      text: "Natural Language Processing (NLP) is a branch of AI that focuses on the interaction between computers and human language. NLP techniques enable machines to understand, interpret, and generate human language in a valuable way. Applications include sentiment analysis, language translation, chatbots, and text summarization. Recent advances in transformer models have significantly improved NLP capabilities.",
      wordCount: 54,
      questionCount: 3,
    },
    {
      id: "chunk-4",
      text: "Computer vision is another crucial area of AI that enables machines to interpret and understand visual information from the world. This technology powers applications such as facial recognition, autonomous vehicles, medical image analysis, and quality control in manufacturing. Convolutional Neural Networks (CNNs) are particularly effective for image processing tasks.",
      wordCount: 48,
      questionCount: 2,
    },
    {
      id: "chunk-5",
      text: "The ethical implications of AI development cannot be overlooked. As AI systems become more prevalent and powerful, concerns about bias, privacy, job displacement, and decision transparency have emerged. Responsible AI development requires careful consideration of these factors, implementation of fairness measures, and ongoing monitoring to ensure AI systems benefit society as a whole.",
      wordCount: 55,
      questionCount: 3,
    },
  ];

  const dummyQuestions = [
    // Chunk 1 questions
    {
      id: "qa-1",
      chunkId: "chunk-1",
      chunkText: dummyChunks[0].text,
      question:
        "What industries have been revolutionized by Artificial Intelligence?",
      answer:
        "According to the document, AI has revolutionized various industries including healthcare and finance. These industries are implementing AI technologies to automate processes, enhance decision-making, and provide insights that were previously impossible to obtain.",
      status: "approved",
      confidence: 0.92,
      model: "google/gemini-2.5-flash",
      label: "1.2 Definitions",
      createdAt: "2025/9/26 10:18:29",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 4,
      customTags: ["AI", "Industries"],
      note: "Well-structured answer covering key industries",
      characterCount: 245,
      tokenCount: 65,
    },
    {
      id: "qa-2",
      chunkId: "chunk-1",
      chunkText: dummyChunks[0].text,
      question:
        "How does machine learning differ from traditional programming?",
      answer:
        "Machine learning, a subset of AI, enables systems to learn and improve from experience without being explicitly programmed for every scenario. This differs from traditional programming where every instruction must be explicitly coded.",
      status: "pending",
      confidence: 0.88,
      model: "google/gemini-2.5-flash",
      label: "1.3 Technical Concepts",
      createdAt: "2025/9/26 10:19:15",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 0,
      customTags: ["Machine Learning", "Programming"],
      note: "",
      characterCount: 198,
      tokenCount: 52,
    },
    {
      id: "qa-3",
      chunkId: "chunk-1",
      chunkText: dummyChunks[0].text,
      question: "What are the main benefits of implementing AI technologies?",
      answer:
        "The main benefits include automating processes, enhancing decision-making, and providing insights that were previously impossible to obtain across various industries.",
      status: "approved",
      confidence: 0.9,
      model: "google/gemini-2.5-flash",
      label: "1.4 Applications",
      createdAt: "2025/9/26 10:20:02",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 5,
      customTags: ["AI", "Benefits"],
      note: "Comprehensive overview of AI benefits",
      characterCount: 165,
      tokenCount: 42,
    },
    // Chunk 2 questions
    {
      id: "qa-4",
      chunkId: "chunk-2",
      chunkText: dummyChunks[1].text,
      question: "How do deep neural networks mimic the human brain?",
      answer:
        "Deep neural networks mimic the human brain's structure through their architecture, which allows for sophisticated pattern recognition and feature extraction. They utilize multiple layers to process complex data patterns similar to how the brain processes information.",
      status: "approved",
      confidence: 0.94,
      model: "google/gemini-2.5-flash",
      label: "2.1 Deep Learning",
      createdAt: "2025/9/26 10:21:30",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 4,
      customTags: ["Deep Learning", "Neural Networks"],
      note: "Clear explanation of neural network mimicry",
      characterCount: 210,
      tokenCount: 55,
    },
    {
      id: "qa-5",
      chunkId: "chunk-2",
      chunkText: dummyChunks[1].text,
      question: "What types of data can deep learning networks analyze?",
      answer:
        "Deep learning networks can analyze vast amounts of unstructured data, including images, text, and audio, to extract meaningful information from these complex data patterns.",
      status: "pending",
      confidence: 0.87,
      model: "google/gemini-2.5-flash",
      label: "2.2 Data Analysis",
      createdAt: "2025/9/26 10:22:18",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 0,
      customTags: ["Deep Learning", "Data"],
      note: "",
      characterCount: 175,
      tokenCount: 46,
    },
    // Chunk 3 questions
    {
      id: "qa-6",
      chunkId: "chunk-3",
      chunkText: dummyChunks[2].text,
      question: "What is Natural Language Processing (NLP)?",
      answer:
        "Natural Language Processing (NLP) is a branch of AI that focuses on the interaction between computers and human language. It enables machines to understand, interpret, and generate human language in a valuable way.",
      status: "approved",
      confidence: 0.96,
      model: "google/gemini-2.5-flash",
      label: "3.1 NLP Basics",
      createdAt: "2025/9/26 10:23:45",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 5,
      customTags: ["NLP", "AI"],
      note: "Excellent definition of NLP",
      characterCount: 180,
      tokenCount: 48,
    },
    {
      id: "qa-7",
      chunkId: "chunk-3",
      chunkText: dummyChunks[2].text,
      question: "What are some applications of NLP technology?",
      answer:
        "NLP applications include sentiment analysis, language translation, chatbots, and text summarization. Recent advances in transformer models have significantly improved these NLP capabilities.",
      status: "approved",
      confidence: 0.91,
      model: "google/gemini-2.5-flash",
      label: "3.2 NLP Applications",
      createdAt: "2025/9/26 10:24:32",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 4,
      customTags: ["NLP", "Applications"],
      note: "Good overview of NLP applications",
      characterCount: 195,
      tokenCount: 51,
    },
    {
      id: "qa-8",
      chunkId: "chunk-3",
      chunkText: dummyChunks[2].text,
      question: "How have transformer models impacted NLP?",
      answer:
        "Recent advances in transformer models have significantly improved NLP capabilities, enhancing the performance of applications like sentiment analysis, language translation, and text summarization.",
      status: "pending",
      confidence: 0.89,
      model: "google/gemini-2.5-flash",
      label: "3.3 Transformer Models",
      createdAt: "2025/9/26 10:25:19",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 0,
      customTags: ["NLP", "Transformer Models"],
      note: "",
      characterCount: 185,
      tokenCount: 49,
    },
    // Chunk 4 questions
    {
      id: "qa-9",
      chunkId: "chunk-4",
      chunkText: dummyChunks[3].text,
      question: "What applications does computer vision power?",
      answer:
        "Computer vision powers applications such as facial recognition, autonomous vehicles, medical image analysis, and quality control in manufacturing.",
      status: "approved",
      confidence: 0.93,
      model: "google/gemini-2.5-flash",
      label: "4.1 Computer Vision Applications",
      createdAt: "2025/9/26 10:26:46",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 5,
      customTags: ["Computer Vision", "Applications"],
      note: "Excellent examples of computer vision applications",
      characterCount: 160,
      tokenCount: 41,
    },
    {
      id: "qa-10",
      chunkId: "chunk-4",
      chunkText: dummyChunks[3].text,
      question: "Why are CNNs effective for image processing?",
      answer:
        "Convolutional Neural Networks (CNNs) are particularly effective for image processing tasks because they are specifically designed to interpret and understand visual information, making them ideal for computer vision applications.",
      status: "pending",
      confidence: 0.85,
      model: "google/gemini-2.5-flash",
      label: "4.2 CNNs",
      createdAt: "2025/9/26 10:27:33",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 0,
      customTags: ["Computer Vision", "CNNs"],
      note: "",
      characterCount: 190,
      tokenCount: 50,
    },
    // Chunk 5 questions
    {
      id: "qa-11",
      chunkId: "chunk-5",
      chunkText: dummyChunks[4].text,
      question: "What ethical concerns arise from AI development?",
      answer:
        "Ethical concerns about AI development include bias, privacy issues, job displacement, and decision transparency. These concerns have emerged as AI systems become more prevalent and powerful.",
      status: "approved",
      confidence: 0.92,
      model: "google/gemini-2.5-flash",
      label: "5.1 Ethical Concerns",
      createdAt: "2025/9/26 10:29:00",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 4,
      customTags: ["AI", "Ethics"],
      note: "Comprehensive list of ethical concerns",
      characterCount: 175,
      tokenCount: 45,
    },
    {
      id: "qa-12",
      chunkId: "chunk-5",
      chunkText: dummyChunks[4].text,
      question: "What does responsible AI development require?",
      answer:
        "Responsible AI development requires careful consideration of ethical factors, implementation of fairness measures, and ongoing monitoring to ensure AI systems benefit society as a whole.",
      status: "approved",
      confidence: 0.94,
      model: "google/gemini-2.5-flash",
      label: "5.2 Responsible AI",
      createdAt: "2025/9/26 10:29:47",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 5,
      customTags: ["AI", "Responsibility"],
      note: "Clear guidelines for responsible AI development",
      characterCount: 190,
      tokenCount: 50,
    },
    {
      id: "qa-13",
      chunkId: "chunk-5",
      chunkText: dummyChunks[4].text,
      question: "Why is ongoing monitoring important for AI systems?",
      answer:
        "Ongoing monitoring is important to ensure AI systems continue to benefit society as a whole and to address any emerging ethical concerns or biases that may develop over time.",
      status: "pending",
      confidence: 0.88,
      model: "google/gemini-2.5-flash",
      label: "5.3 Monitoring",
      createdAt: "2025/9/26 10:30:34",
      textChunk: "Cap 459 Consolidated version for the...",
      rating: 0,
      customTags: ["AI", "Monitoring"],
      note: "",
      characterCount: 165,
      tokenCount: 43,
    },
  ];

  return {
    id: Date.now(),
    name: "AI_Fundamentals_Guide.pdf",
    size: 2457600, // ~2.4MB
    uploadedAt: new Date().toISOString(),
    status: "completed" as const,
    chunks: dummyChunks,
    questions: dummyQuestions,
  };
}
