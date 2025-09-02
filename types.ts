
export interface GradingResult {
  score: number;
  maxScore: number;
  feedback: string;
  reasoning: string;
}

export interface StudentSubmission {
  id: string;
  fileName: string;
  code: string;
  result: GradingResult | null;
  error?: string;
}

export interface GradingSession {
  id: string;
  title: string;
  instruction: string;
  gradingMode: 'output' | 'logic';
  expectedOutput: string;
  rubric: string;
  submissions: StudentSubmission[];
}
