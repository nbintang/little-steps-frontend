import { QuizzesAPI } from "./quizzes";

export interface QuizWithQuestionsAPI extends QuizzesAPI {
    questions: Array<QuestionAPI>;
}

export type QuestionAPI =   {
    id: string;
    questionJson: any;
    answers: Array<{
      id: string;
      text: string;
      imageAnswer: string | null;
      isCorrect: boolean;
    }>;
  };