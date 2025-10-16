
export type ProgressQuizAPI = {
  id: string
  childId: string
  quizId: string
  score: number
  completionPercent: number
  startedAt: string
  submittedAt: any
}





export type QuizDatum = {
  date: string; // YYYY-MM-DD
  score: number;
  completionPercent: number;
  quizTitle: string;
  category: string;
  childName: string;
};

export type QuizMeta = {
  totalQuizzes: number;
  totalScore: number;
  avgScore: number;
  avgCompletion: number;
};

export interface SuccessResponseQuizProgress {
  success?: true;
  data?: QuizDatum[];
  meta?: QuizMeta
}