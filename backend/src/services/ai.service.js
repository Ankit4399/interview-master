const {GoogleGenAI } = require('@google/genai')
const {z} = require('zod')
const { zodToJsonSchema } =  require("zod-to-json-schema");
const puppeteer = require("puppeteer")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({resume,selfDescription,jobDescription}) {
    // detailed prompt with explicit JSON structure instructions
    const prompt = `Generate a detailed interview report for a candidate. Respond with ONLY valid JSON, nothing else.

CANDIDATE DETAILS:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

REQUIRED JSON STRUCTURE (follow exactly):
{
  "matchScore": <number 0-100>,
  "title": "<job title string>",
  "technicalQuestions": [
    {
      "question": "<question text>",
      "intention": "<why this question is asked>",
      "answer": "<how to answer this question>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<question text>",
      "intention": "<why this question is asked>",
      "answer": "<how to answer this question>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<skill name>",
      "severity": "low" or "medium" or "high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "<main focus area>",
      "tasks": ["<task 1>"]
    }
  ]
}

IMPORTANT:
- technicalQuestions MUST be an array of objects with "question", "intention", and "answer" fields (NOT strings or numbers)
- behavioralQuestions MUST be an array of objects with "question", "intention", and "answer" fields (NOT strings or numbers)
- skillGaps MUST be an array of objects with "skill" string and "severity" enum (low/medium/high) (NOT strings or numbers)
- preparationPlan MUST be an array of objects with "day" number, "focus" string, and "tasks" array of strings (NOT strings or numbers)
- matchScore must be a number between 0 and 100
- title must be a string
- DO NOT enumerate items with numeric prefixes; only output JSON data
- Include 3-5 technical questions, 2-3 behavioral questions, 2-4 skill gaps, and a 3-5 day preparation plan
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    });

    let parsed;
    try {
        parsed = JSON.parse(response.text);
    } catch (err) {
        console.error("Failed to parse AI response as JSON:", response.text);
        throw new Error("AI returned invalid JSON in interview report");
    }

    // attempt to un-stringify any of the expected arrays or their items
    [
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
    ].forEach((field) => {
        if (typeof parsed[field] === "string") {
            try {
                parsed[field] = JSON.parse(parsed[field]);
            } catch (e) {
                // let schema validation catch it
            }
        }

        if (Array.isArray(parsed[field])) {
            parsed[field] = parsed[field].map((item) => {
                if (typeof item === "string") {
                    try {
                        return JSON.parse(item);
                    } catch (e) {
                        // trim whitespace and try again with closing brace
                        try {
                            return JSON.parse(item.trim());
                        } catch (e2) {
                            return item;
                        }
                    }
                }
                return item;
            });
        }
    });

    try {
        parsed = interviewReportSchema.parse(parsed);
    } catch (err) {
        console.error("AI response did not match expected schema:", err.errors, parsed);
        // if arrays are the only problem we can attempt to regenerate them one by one
        await repairArrays(parsed, {resume,selfDescription,jobDescription});
        // validate again after repair
        parsed = interviewReportSchema.parse(parsed);
    }

    return parsed;
}

// helper to regenerate individual array fields when they fail
async function repairArrays(parsed, {resume,selfDescription,jobDescription}) {
    const fieldConfigs = {
        technicalQuestions: z.array(z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })),
        behavioralQuestions: z.array(z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })),
        skillGaps: z.array(z.object({
            skill: z.string(),
            severity: z.enum(["low","medium","high"]),
        })),
        preparationPlan: z.array(z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string()),
        })),
    };

    for (const field of Object.keys(fieldConfigs)) {
        const arr = parsed[field];
        const valid = Array.isArray(arr) && arr.length && typeof arr[0] === 'object';
        if (!valid) {
            console.warn(`Field ${field} invalid or empty, regenerating separately`);
            try {
                parsed[field] = await generateField(field, fieldConfigs[field], {resume,selfDescription,jobDescription});
            } catch (e) {
                console.error(`Failed to regenerate ${field}:`, e);
                parsed[field] = [];
            }
        }
    }
}
// helper to regenerate a specific array field with a focused prompt
async function generateField(fieldName, schema, {resume,selfDescription,jobDescription}) {
    // provide a simple hard‑coded example depending on field
    let example;
    switch (fieldName) {
        case 'technicalQuestions':
            example = `[
  {"question": "<text>", "intention": "<text>", "answer": "<text>"}
]`;
            break;
        case 'behavioralQuestions':
            example = `[
  {"question": "<text>", "intention": "<text>", "answer": "<text>"}
]`;
            break;
        case 'skillGaps':
            example = `[
  {"skill": "<text>", "severity": "low|medium|high"}
]`;
            break;
        case 'preparationPlan':
            example = `[
  {"day": 1, "focus": "<text>", "tasks": ["<text>"]}
]`;
            break;
        default:
            example = `[]`;
    }
    const fieldPrompt = `Using the candidate details below, produce ONLY a JSON array for "${fieldName}". ` +
        `Each element of the array must exactly match the structure described and contain real text; do not wrap objects in strings or add any surrounding explanation.\n\n` +
        `Resume: ${resume}\nSelf Description: ${selfDescription}\nJob Description: ${jobDescription}\n\n` +
        `The JSON array should look like this example (replace the placeholder values):\n` +
        `${example}\n`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fieldPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(schema),
        }
    });
    let arr;
    try {
        arr = JSON.parse(response.text);
    } catch (err) {
        console.error(`Could not parse ${fieldName} array response`, response.text);
        throw err;
    }
    // try to normalise string items if necessary
    if (Array.isArray(arr)) {
        arr = arr.map(item => {
            if (typeof item === 'string') {
                try { return JSON.parse(item); } catch { return item; }
            }
            return item;
        });
    }
    // validate against schema
    try {
        return schema.parse(arr);
    } catch (err) {
        console.error(`Regenerated ${fieldName} did not match schema`, err.errors, arr);
        throw err;
    }
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }