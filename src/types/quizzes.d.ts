export type QuizzesAPI = {
  id: string;
  title: string;
  rating: number;
  description: string;
  createdAt: string;
  timeLimit: number;
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  questionCount: number;
};



export type QuizMutateResponseAPI = {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  rating: number;
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  createdAt: Date |  string;
}