import { QuizzesAPI } from "./quizzes";

export interface QuizWithQuestionsAPI extends QuizzesAPI {
    questions: Array<Questions>;
}

export type Questions =   {
    id: string;
    questionJson: any;
    answers: Array<{
      id: string;
      text: string;
      imageAnswer: string | null;
      isCorrect: boolean;
    }>;
  };