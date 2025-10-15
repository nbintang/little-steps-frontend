// types/quiz.ts

export type Answer = {
  id: string;
  text: string;
  imageAnswer: string | null;
};

export type Question = {
  id: string;
  questionJson: any;
  answers: Answer[];
};

export type QuizDetail = {
  id: string;
  title: string;
  description: string | null;
  timeLimit: number | null;
  rating: number | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
};

export type QuizForPlay = {
  data: Question[];
  meta: {
    page: number;
    limit: number;
    totalQuestions: number;
    totalPages: number;
  };
};

export type Progress = {
  id: string;
  quizId: string;
  childId: string;
  score: number | null;
  timeLimit: number;
  completionPercent: number | null;
  startedAt: string;
  submittedAt: string | null;
};

export type SubmitQuizPayload = {
  answers: Array<{
    questionId: string;
    selectedAnswerId: string | null;
  }>;
};

export type SubmitQuizResponse = {
  message: string;
  data: Progress;
};

type QuizListItem = {
  id: string;
  title: string;
  rating: number;
  description: string;
  timeLimit: number;
  createdAt: string;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  questionCount: number;
  progress: {
    id: string;
    score: number;
    completionPercent: number;
    startedAt: Date | string;
    submittedAt: Date | null;
  } | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
};
