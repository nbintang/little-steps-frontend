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
