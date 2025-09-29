import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// export const API_URL = "https://hkscss-cms.vercel.app";
export const API_URL = "http://localhost:1717";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const ProjectData = {
//   id: "aEZQMFS9s5l3",
//   name: "HKCSS",
//   description: "",
//   globalPrompt: "use english",
//   questionPrompt:
//     "Try to keep it concise and generate question in english only",
//   answerPrompt:
//     'For each generated question, provide a precise answer grounded only in the source text. Always include the section , page and doc_id and keep the answers in 200 words \nGuidelines:\n- Copy critical wording directly from the law or code.\n- If the section lists items, return the answer as a bullet list.\n- If bilingual source text is provided, produce only English answers.\n- If the answer is not found in the given text, respond with: "Not specified in this section."\n- Always include reference metadata: {doc_id, section, page}.\n',
//   labelPrompt: "",
//   domainTreePrompt:
//     'Analyze the provided section and identify its domain and sub-domain for organizing Q&A. \nExample:\n- Domain: Licensing\n- Sub-domain: Application requirements\n- Section: Part II, Section 5\nReturn as JSON: {"domain":"Licensing","subdomain":"Application","section":"Part II Section 5"}\n',
//   cleanPrompt:
//     "Clean and normalize generated questions and answers:\n- Remove duplicates.\n- Standardize phrasing of similar questions.\n- Ensure answers follow the same style (bullets for lists, citations included).\n- Trim unnecessary words, keep answers concise but faithful to the source.\n- Verify output is aligned in meaning.\n",
//   defaultModelConfigId: "gpNt6ld-dZ83",
//   test: "",
//   createAt: "2025-09-22T10:00:07.081Z",
//   updateAt: "2025-09-22T16:16:10.032Z",
//   _count: {
//     Datasets: 0,
//     Questions: 0,
//   },
// };

export const ProjectData = {
  id: "w4a6Gfze-zNb",
  name: "HKSCSS Datatsets",
  description: "",
  globalPrompt: "use english",
  questionPrompt:
    "You are given a text chunk from a legal or compliance document (e.g., Residential Care Homes Ordinance, Code of Practice, application form, or guideline).\n\nGenerate **3–5 clear, self-contained questions** that a person might ask about this chunk.\n\nRules:\n- Questions must be directly answerable using only the given text.\n- Paraphrase naturally; do not just copy sentences.\n- Avoid references to section numbers, page numbers, or metadata.\n- Focus on practical, factual queries (what, when, who, how, requirements, definitions).\n- Return only the list of questions.\n",
  answerPrompt:
    "You are an expert at producing clear, explanatory answers from legal and compliance documents.\n\nYou are given a text chunk and one of the questions generated from it.\n\nWrite a direct, natural-language answer to the question.\n\nRules:\n- Do not return section numbers, page numbers, or doc IDs.\n- Use your own words to summarize the meaning.\n- Keep answers factual, concise, and reader-friendly.\n- If the text defines a term, explain it clearly.\n- If requirements or processes are listed, summarize them step by step.\n- Return only the final answer.\n",
  labelPrompt: "",
  domainTreePrompt:
    'Given a question and its answer, classify them into a hierarchical structure:\n\n- domain: Broad area (e.g., "Licensing", "Compliance", "Guidelines")\n- subdomain: More specific area (e.g., "Application", "Renewal", "Drug Management")\n- section: Thematic grouping from the text if identifiable (e.g., "Part II Section 5")\n\nReturn the result in JSON:\n{"domain":"...", "subdomain":"...", "section":"..."}\n',
  cleanPrompt:
    "Clean and normalize generated questions and answers:\n\n- Remove duplicates.\n- Standardize phrasing of similar questions.\n- Ensure questions are clear and grammatically correct.\n- Ensure answers are concise, in plain English, and free of metadata (no section/page references).\n- Keep only unique GA pairs.\n",
  defaultModelConfigId: "dd0jAqYB2F1e",
  test: "",
  createAt: "2025-09-29T18:39:05.106Z",
  updateAt: "2025-09-29T18:50:42.634Z",
  _count: {
    Datasets: 1,
    Questions: 369,
  },
};

export const selectedModel = {
  // id: "gpNt6ld-dZ83",
  id: "dd0jAqYB2F1e",
  projectId: "w4a6Gfze-zNb",
  providerId: "openRouter",
  providerName: "OpenRouter",
  endpoint: "https://openrouter.ai/api/v1/",
  // apiKey:"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",
  apiKey:
    "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",
  modelId: "google/gemini-2.5-flash",
  modelName: "google/gemini-2.5-flash",
  type: "text",
  temperature: 0.7,
  maxTokens: 8192,
  topP: 0,
  topK: 0,
  status: 1,
  createAt: "2025-09-22T10:00:07.265Z",
  updateAt: "2025-09-22T10:00:07.265Z",
};

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
      name: "Cap 459 Consolidated version for the Whole Chapter (26-07-2024) (English and Traditional Chinese)-part-1",
      text: `《安老院條例》 (第459章)

Residential Care Homes (Elderly Persons) Ordinance (Cap. 459) 版本日期: 26.7.2024

經核證文本 Verified Copy 《法例發布條例》(第614章)第5條 (Legislation Publication Ordinance (Cap. 614), section 5)

如某內頁的頁底標明:

“經核證文本”；及
以下列表顯示的該頁的最後更新日期， 該頁所載條文即視作於上述“版本日期”的正確版本。 此文本所載條文，如並非正在實施，會有附註作說明。
A provision is presumed to be correctly stated as at the above version date if it is on a page marked at the bottom with:

the words “Verified Copy”; and
the last updated date shown in this table for the page. Any provision included in this copy that is not in force is marked accordingly.
條文 Provision | 頁數 Page number | 最後更新日期 Last updated date ---|---|--- 第1部 Part 1 | 1-1—1-10 | 16.6.2024 第2部 Part 2 | 2-1—2-4 | 16.6.2024 第3部 Part 3 | 3-1—3-2 | 16.6.2024 第4部 Part 4 | 4-1—4-36 | 16.6.2024 第5部 Part 5 | 5-1—5-2 | 16.6.2024 第6部 Part 6 | 6-1—6-8 | 26.7.2024 第7部 Part 7 | 7-1—7-16 | 16.6.2024 附表1 Schedule 1 | S1-1—S1-10 | 16.6.2024 附表2 Schedule 2 | S2-1—S2-4 | 16.6.2024

尚未實施的條文 / 修訂 — 尚未實施的條文及修訂的資料，可於「電子版香港法例」(https://www.elegislation.gov.hk) 閱覽。 Provisions / Amendments not yet in operation — Please see Hong Kong e-Legislation (https://www.elegislation.gov.hk) for information of provisions and amendments not yet in operation.

制定史 本為1994年第90號 — 1997年第362號法律公告，1998年第25號，1999年第17號，2004年第29號法律公告，2011年第12號，2012年第1號編輯修訂紀錄，2018年第34號，2018年第5號編輯修訂紀錄，2020年第4號編輯修訂紀錄，2020年第21號，2023年第12號，2024年第24號。

Enactment History Originally 90 of 1994 — L.N. 362 of 1997, 25 of 1998, 17 of 1999, L.N. 29 of 2004, 12 of 2011, E.R. 1 of 2012, 34 of 2018, E.R. 5 of 2018, E.R. 4 of 2020, 21 of 2020, 12 of 2023, 24 of 2024.

《安老院條例》 (第459章)

目錄 條次 頁次

第1部 導言

簡稱 1-1
釋義 1-1
適用範圍 1-5`,
      wordCount: 58,
      questionCount: 3,
    },
    {
      id: "chunk-2",
      name: "Cap 459 Consolidated version for the Whole Chapter (26-07-2024) (English and Traditional Chinese)-part-2",
      text: `4. 署長職能的履行 1-7
5. 行政長官發出指示的權力 1-9
第 2 部
對營辦安老院的限制
6. 安老院須領有牌照 2-1
6A. 若干殘疾人士院舍不受第 6 條規限 2-1
6B. 若干護養院不受第 6 條規限 2-3
第 3 部
(廢除)
7. (廢除) 3-1
Residential Care Homes (Elderly Persons) Ordinance
(Cap. 459)
Contents
Section Page Part 1 Preliminary

Short title 1-2
Interpretation 1-2
Application 1-6
Exercise of Director’s functions 1-8
Power of Chief Executive to give directions 1-10
Part 2 Restriction on Operation of Residential Care Homes 6. Residential care homes must be licensed 2-2 6A. Certain residential care homes for PWDs excepted from application of section 6 2-2 6B. Certain nursing homes excepted from application of section 6 2-4

Part 3 (Repealed) 7. (Repealed) 3-2 最後更新日期 Last updated date T-1 T-2 第 459 章 Cap. 459

第 4 部
牌照
條次 頁次
第 1 分部 —— 牌照申請
8. 牌照的申請及發出 4-1
8A. 關於牌照申請人是否適當人選的規定 4-7
9. 牌照續期 4-7
10. 撤銷及暫時吊銷牌照、拒絕續期、修訂或更改條件 4-9
11. 拒絕發出牌照或將牌照續期的通知及撤銷或暫時吊銷牌照的通知等 4-15
第 2 分部 —— 負責人
11A. 牌照申請人須提名負責人 4-15
11B. 某些營辦人在續期申請時須提名負責人 4-17
11C. 如何提名負責人 4-19
11D. 負責人的職務 4-21
11E. 關於負責人是否適當人選的規定 4-21
11F. 按署長要求更換負責人 4-21
11G. 因去世、無行為能力等而更換負責人 4-23
Part 4 Licences Section Page Division 1—Licence Applications 8. Application for and issue of licence 4-2 8A. Fit and proper requirement for licence applicant 4-8 9. Renewal of licence 4-8 10. Cancellation and suspension of licence or refusal to renew and amendment or variation of conditions 4-10 11. Notice of refusal to issue or renew licence and of cancellation or suspension, etc. 4-16

Division 2—Responsible Persons 11A. Licence applicant to propose responsible person 4-16 11B. Certain operators to propose responsible person on renewal application`,
      wordCount: 52,
      questionCount: 2,
    },
    {
      id: "chunk-3",
      name: "Chunk Details: Cap 459 Consolidated version for the Whole Chapter (26-07-2024) (English and Traditional Chinese)-part-3",
      text: `4-18
11C. How to propose responsible person 4-20 11D. Duties of responsible person 4-22 11E. Fit and proper requirement for responsible person 4-22 11F. Change of responsible person as required by Director 4-22 11G. Change of responsible person because of death, incapacity, etc. 4-24

最後更新日期 Last updated date T-3 T-4 第 459 章 Cap. 459

條次 頁次 11H. 在其他情況下更換負責人 4-25 11I. 署長須指明成為負責人的日期 4-27

第 3 分部 — 申報規定 11J. 營辦人須申報某些事件 4-27

第 5 部 上訴 12. 對署長的決定提出上訴 5-1 13-16. (廢除) 5-1

第 6 部 安老院的監管 17. 督察的委任 6-1 18. 視察安老院 6-1 18A. 對指明人士若干作為及不作為的法律責任的保障 6-3 19. 署長可指示糾正措施 6-5 20. 署長可下令停止將處所用作安老院 6-5

第 7 部 雜項 21. 關於牌照的罪行 7-1 21A. 負責人的法律責任 7-5 21B. 董事、合夥人等的法律責任 7-5

Section Page 11H. Change of responsible person in other circumstances 4-26 11I. Director to specify date of becoming responsible person 4-28 Division 3—Reporting Requirements 11J. Operator to report certain events 4-28 Part 5 Appeals 12. Appeals against decisions of Director 5-2 13-16. (Repealed) 5-2 Part 6 Supervision of Residential Care Homes 17. Appointment of inspectors 6-2 18. Inspection of residential care homes 6-2 18A. Protection of specified persons from liability for certain acts and omissions 6-4 19. Director may direct remedial measures 6-6 20. Director may order cessation of use of premises as a residential care home 6-6 Part 7 Miscellaneous 21. Offences in relation to licences 7-2 21A. Liability of responsible person 7-6 21B. Liability of directors, partners, etc. 7-6

最後更新日期 Last updated date T-5 T-6 第 459 章 Cap. 459

條次 頁次 21C. 罪行的檢控期限 7-7 22. 與安老院的營辦有關的實務守則 7-7 23. 規例 7-9 24. 無須就牌照繳付費用 7-13 附表 1 關於牌照申請人是否適當人選的規定 S1-1`,
      wordCount: 54,
      questionCount: 3,
    },
    {
      id: "chunk-4",
      name: "Cap 459 Consolidated version for the Whole Chapter (26-07-2024) (English and Traditional Chinese)-part-4",
      text: `Section Page 21C. Prosecution deadline for offences 7-8 22. Codes of Practice relating to operation of residential care homes 23. Regulation 7-10 24. No fee payable in respect of licence 7-14 Schedule 1 Fit and Proper Requirement for Licence Applicant S1-2 Schedule 2 Fit and Proper Requirement for Responsible Person S2-2

最後更新日期 Last updated date T-7 T-8 第 459 章 Cap. 459 經核證文本 Verified Copy

本條例旨在規管為年滿 60 歲的人士提供住宿照顧而設立的安老院。 [1995 年 4 月 1 日 ] 1995 年第 95 號法律公告 (格式變更——2012 年第 1 號編輯修訂紀錄) (略去制定語式條文——2012 年第 1 號編輯修訂紀錄)

第 1 部 導言

簡稱 (編輯修訂——2020 年第 4 號編輯修訂紀錄) (1) 本條例可引稱為《安老院條例》。 (2) (已失時效而略去——2012 年第 1 號編輯修訂紀錄)

釋義 (1) 在本條例中，除文意另有所指外—— (由 2023 年第 12 號第 3 條修訂) 安老院 (residential care home) 指慣常有超過 5 名年滿 60 歲的人士獲收容在其內住宿以便獲得照顧的處所； 負責人 (responsible person) 就某安老院而言，指符合以下說明的人—— (a) 已根據第 11A(2)、11B(2) 或 11I(4) 條成為該安老院的負責人；及

An Ordinance to regulate homes established for the residential care of persons who have attained the age of 60 years. [1 April 1995] L.N. 95 of 1995 (Format changes—E.R. 1 of 2012) (Enacting provision omitted—E.R. 1 of 2012)

Part 1`,
      wordCount: 48,
      questionCount: 2,
    },
    {
      id: "chunk-5",
      name: "Cap 459 Consolidated version for the Whole Chapter (26-07-2024) (English and Traditional Chinese)-part-5",
      text: `1. Short title (1) This Ordinance may be cited as the Residential Care Homes (Elderly Persons) Ordinance.

2. Interpretation (1) In this Ordinance, unless the context otherwise requires— "Cap. 613" (《第613章》) means the Residential Care Homes (Persons with Disabilities) Ordinance (Cap. 613); "Cap. 613A" (《第613A章》) means the Residential Care Homes (Persons with Disabilities) Regulation (Cap. 613 sub. leg. A); "Director" (署長) means the Director of Social Welfare;`,
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
        "If a sole proprietorship operating an elderly care home has an individual managing it who is not the sole proprietor, what specific responsibilities and liabilities would that 'management officer' incur under the definition provided, and how might this impact our operational compliance",
      answer: `If your sole proprietorship elderly care home has an individual managing it who is not the sole proprietor, that individual would be classified as a "management officer" under the provided definition. As a management officer, their primary responsibility, as implied by the definition, is to be "concerned in the management of the sole proprietorship."


While the provided text defines who a management officer is, it does not explicitly detail the specific responsibilities or liabilities that such an individual would incur. Therefore, based solely on this definition, we cannot determine specific legal responsibilities or liabilities.


However, from an operational compliance perspective, recognizing this individual as a "management officer" is crucial. This classification suggests that any actions or decisions made by this individual in their management capacity could directly impact the sole proprietorship's adherence to regulations. Although the current text doesn't outline penalties or duties for management officers, in a regulatory context, individuals "concerned in the management" are often held accountable for ensuring compliance within their scope of authority. Therefore, it is prudent to assume that their conduct directly influences the elderly care home's overall compliance and potential risks.`,
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
        "为了理解安老院的相关法规，潜在投资者需要查阅哪些具体的法例和规章",
      answer: `为了理解安老院的相关法规，潜在投资者需要查阅以下具体的法例和规章：



《安老院条例》：这是理解安老院运营基本法律框架的核心条例。

《残疾人士院舍条例》（第613章）：虽然名称是针对残疾人士院舍，但根据解释，该条例与安老院法规可能存在关联，需要进一步查阅其具体内容以明确适用范围。

《残疾人士院舍规例》（第613A章）：作为《残疾人士院舍条例》的附属法例，它提供了更详细的实施细则，同样需要查阅以了解可能对安老院运营产生影响的具体规定。


这些法例和规章构成了安老服务行业合规性的基础，投资者应仔细研究以确保未来运营符合法律要求。`,
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
      question: "How many reportable infectious diseases are currently listed",
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
    // {
    //   id: "qa-6",
    //   chunkId: "chunk-3",
    //   chunkText: dummyChunks[2].text,
    //   question: "What is Natural Language Processing (NLP)?",
    //   answer:
    //     "Natural Language Processing (NLP) is a branch of AI that focuses on the interaction between computers and human language. It enables machines to understand, interpret, and generate human language in a valuable way.",
    //   status: "approved",
    //   confidence: 0.96,
    //   model: "google/gemini-2.5-flash",
    //   label: "3.1 NLP Basics",
    //   createdAt: "2025/9/26 10:23:45",
    //   textChunk: "Cap 459 Consolidated version for the...",
    //   rating: 5,
    //   customTags: ["NLP", "AI"],
    //   note: "Excellent definition of NLP",
    //   characterCount: 180,
    //   tokenCount: 48,
    // },
    // {
    //   id: "qa-7",
    //   chunkId: "chunk-3",
    //   chunkText: dummyChunks[2].text,
    //   question: "What are some applications of NLP technology?",
    //   answer:
    //     "NLP applications include sentiment analysis, language translation, chatbots, and text summarization. Recent advances in transformer models have significantly improved these NLP capabilities.",
    //   status: "approved",
    //   confidence: 0.91,
    //   model: "google/gemini-2.5-flash",
    //   label: "3.2 NLP Applications",
    //   createdAt: "2025/9/26 10:24:32",
    //   textChunk: "Cap 459 Consolidated version for the...",
    //   rating: 4,
    //   customTags: ["NLP", "Applications"],
    //   note: "Good overview of NLP applications",
    //   characterCount: 195,
    //   tokenCount: 51,
    // },
    // {
    //   id: "qa-8",
    //   chunkId: "chunk-3",
    //   chunkText: dummyChunks[2].text,
    //   question: "How have transformer models impacted NLP?",
    //   answer:
    //     "Recent advances in transformer models have significantly improved NLP capabilities, enhancing the performance of applications like sentiment analysis, language translation, and text summarization.",
    //   status: "pending",
    //   confidence: 0.89,
    //   model: "google/gemini-2.5-flash",
    //   label: "3.3 Transformer Models",
    //   createdAt: "2025/9/26 10:25:19",
    //   textChunk: "Cap 459 Consolidated version for the...",
    //   rating: 0,
    //   customTags: ["NLP", "Transformer Models"],
    //   note: "",
    //   characterCount: 185,
    //   tokenCount: 49,
    // },
    // // Chunk 4 questions
    // {
    //   id: "qa-9",
    //   chunkId: "chunk-4",
    //   chunkText: dummyChunks[3].text,
    //   question: "What applications does computer vision power?",
    //   answer:
    //     "Computer vision powers applications such as facial recognition, autonomous vehicles, medical image analysis, and quality control in manufacturing.",
    //   status: "approved",
    //   confidence: 0.93,
    //   model: "google/gemini-2.5-flash",
    //   label: "4.1 Computer Vision Applications",
    //   createdAt: "2025/9/26 10:26:46",
    //   textChunk: "Cap 459 Consolidated version for the...",
    //   rating: 5,
    //   customTags: ["Computer Vision", "Applications"],
    //   note: "Excellent examples of computer vision applications",
    //   characterCount: 160,
    //   tokenCount: 41,
    // },
    // {
    //   id: "qa-10",
    //   chunkId: "chunk-4",
    //   chunkText: dummyChunks[3].text,
    //   question: "Why are CNNs effective for image processing?",
    //   answer:
    //     "Convolutional Neural Networks (CNNs) are particularly effective for image processing tasks because they are specifically designed to interpret and understand visual information, making them ideal for computer vision applications.",
    //   status: "pending",
    //   confidence: 0.85,
    //   model: "google/gemini-2.5-flash",
    //   label: "4.2 CNNs",
    //   createdAt: "2025/9/26 10:27:33",
    //   textChunk: "Cap 459 Consolidated version for the...",
    //   rating: 0,
    //   customTags: ["Computer Vision", "CNNs"],
    //   note: "",
    //   characterCount: 190,
    //   tokenCount: 50,
    // },
    // // Chunk 5 questions
    // {
    //   id: "qa-11",
    //   chunkId: "chunk-5",
    //   chunkText: dummyChunks[4].text,
    //   question: "What ethical concerns arise from AI development?",
    //   answer:
    //     "Ethical concerns about AI development include bias, privacy issues, job displacement, and decision transparency. These concerns have emerged as AI systems become more prevalent and powerful.",
    //   status: "approved",
    //   confidence: 0.92,
    //   model: "google/gemini-2.5-flash",
    //   label: "5.1 Ethical Concerns",
    //   createdAt: "2025/9/26 10:29:00",
    //   textChunk: "Cap 459 Consolidated version for the...",
    //   rating: 4,
    //   customTags: ["AI", "Ethics"],
    //   note: "Comprehensive list of ethical concerns",
    //   characterCount: 175,
    //   tokenCount: 45,
    // },
    // {
    //   id: "qa-12",
    //   chunkId: "chunk-5",
    //   chunkText: dummyChunks[4].text,
    //   question: "What does responsible AI development require?",
    //   answer:
    //     "Responsible AI development requires careful consideration of ethical factors, implementation of fairness measures, and ongoing monitoring to ensure AI systems benefit society as a whole.",
    //   status: "approved",
    //   confidence: 0.94,
    //   model: "google/gemini-2.5-flash",
    //   label: "5.2 Responsible AI",
    //   createdAt: "2025/9/26 10:29:47",
    //   textChunk: "Cap 459 Consolidated version for the...",
    //   rating: 5,
    //   customTags: ["AI", "Responsibility"],
    //   note: "Clear guidelines for responsible AI development",
    //   characterCount: 190,
    //   tokenCount: 50,
    // },
    // {
    //   id: "qa-13",
    //   chunkId: "chunk-5",
    //   chunkText: dummyChunks[4].text,
    //   question: "Why is ongoing monitoring important for AI systems?",
    //   answer:
    //     "Ongoing monitoring is important to ensure AI systems continue to benefit society as a whole and to address any emerging ethical concerns or biases that may develop over time.",
    //   status: "pending",
    //   confidence: 0.88,
    //   model: "google/gemini-2.5-flash",
    //   label: "5.3 Monitoring",
    //   createdAt: "2025/9/26 10:30:34",
    //   textChunk: "Cap 459 Consolidated version for the...",
    //   rating: 0,
    //   customTags: ["AI", "Monitoring"],
    //   note: "",
    //   characterCount: 165,
    //   tokenCount: 43,
    // },
  ];

  return {
    id: Date.now(),
    name: "Cap 459 Consolidated version for the Whole Chapter (26-07-2024) (English and Traditional Chinese).pdf",
    size: 6987936, // ~2.4MB
    uploadedAt: "2025-09-26T05:07:01.415Z",
    status: "completed" as const,
    chunks: dummyChunks,
    questions: dummyQuestions,
  };
}
