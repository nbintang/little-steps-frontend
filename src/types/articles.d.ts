export interface Articles {
  id: string;
  slug: string;
  title: string;
  type: string;
  coverImage: string;
  excerpt: string;
  status: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    slug: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
