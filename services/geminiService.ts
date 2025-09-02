
import { GoogleGenAI, Type } from "@google/genai";
import { GradingResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a client-side check. The actual check is on the server where API is called.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const gradingSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.NUMBER,
            description: "The student's score based on the rubric. This should be a numerical value."
        },
        maxScore: {
            type: Type.NUMBER,
            description: "The maximum possible score according to the rubric. This should be a numerical value."
        },
        feedback: {
            type: Type.STRING,
            description: "Constructive, student-facing feedback explaining the score and highlighting areas for improvement."
        },
        reasoning: {
            type: Type.STRING,
            description: "A step-by-step reasoning for the teacher explaining how the score was determined by applying the rubric to the code's simulated output or logic."
        }
    },
    required: ["score", "maxScore", "feedback", "reasoning"]
};

interface GradingConfig {
    gradingMode: 'output' | 'logic';
    title: string;
    instructions: string;
    expectedOutput: string;
}

export const gradeJavaCode = async (
  studentCode: string,
  rubric: string,
  config: GradingConfig
): Promise<GradingResult> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    
    const { gradingMode, title, instructions, expectedOutput } = config;

    let promptContext = '';
    let analysisInstructions = '';

    if (gradingMode === 'logic') {
        promptContext = `
The student's code should be evaluated based on its logic, correctness, and adherence to the assignment's instructions, not on matching a specific console output. For example, for a calculator assignment, you must check if the calculations are performed correctly.

**ASSIGNMENT INSTRUCTIONS:**
---
${instructions}
---`;
        
        analysisInstructions = `
1.  **Analyze Code:** Carefully read the student's Java code to understand its logic, structure, and functionality.
2.  **Verify Correctness:** Determine if the code correctly implements the logic for the assignment based on the provided "ASSIGNMENT INSTRUCTIONS". This is not about matching a specific output, but about whether the code would work as intended.
3.  **Apply Rubric:** Use the "SCORING RUBRIC" to assign a score based on the code's correctness, structure, and adherence to instructions.
4.  **Generate Feedback:** Provide clear, constructive feedback for the student and a detailed reasoning for the score for the teacher.
5.  **Format Response:** Return your complete evaluation in the specified JSON format. The 'maxScore' should be the highest possible score derivable from the rubric.`;

    } else { // 'output' mode
        promptContext = `
**ASSIGNMENT INSTRUCTIONS:**
---
${instructions}
---
**EXPECTED CONSOLE OUTPUT:**
---
${expectedOutput}
---`;

        analysisInstructions = `
1.  **Analyze Code:** Carefully read the student's Java code to understand its logic, structure, and what it will print to the console.
2.  **Simulate Output:** Mentally execute the code to determine its output.
3.  **Compare Outputs:** Compare the simulated output of the student's code with the "EXPECTED CONSOLE OUTPUT".
4.  **Check Instructions:** Verify if the code adheres to the "ASSIGNMENT INSTRUCTIONS".
5.  **Apply Rubric:** Use the "SCORING RUBRIC" to assign a score based on the comparison and instruction adherence.
6.  **Generate Feedback:** Provide clear, constructive feedback for the student and a detailed reasoning for the score for the teacher.
7.  **Format Response:** Return your complete evaluation in the specified JSON format. The 'maxScore' should be the highest possible score derivable from the rubric.`;
    }

    const prompt = `
You are an expert Java programming instructor AI. Your task is to grade a student's Java code submission for an assignment titled "${title}".

**SCORING RUBRIC:**
---
${rubric}
---
${promptContext}

**STUDENT'S JAVA CODE:**
---
\`\`\`java
${studentCode}
\`\`\`
---

**INSTRUCTIONS FOR AI:**
${analysisInstructions}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: gradingSchema,
                temperature: 0.2,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as GradingResult;
        return result;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid grading result from the AI. Please check the console for details.");
    }
};
