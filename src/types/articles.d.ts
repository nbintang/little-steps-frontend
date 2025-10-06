export interface Articles {
  id: string;
  slug: string;
  title: string;
  type: "ARTICLE" ;
  coverImage: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED" ;
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
export type Article = {
  id: string
  slug: string
  title: string
  type: "ARTICLE" ;
  coverImage: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED" ;
  contentJson: string
  category: {
    id: string
    slug: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export type ArticleMutateResponse = {
  id: string;
  title: string;
  slug: string;
  type: "ARTICLE" | string;
  contentJson: any; // bisa juga Record<string, any>
  excerpt: string;
  coverImage: string;
  rating: number;
  status: "DRAFT" | "PUBLISHED" | string;
  isEdited: boolean;
  categoryId: string;
  createdBy: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  category: {
    id: string;
    slug: string;
    name: string;
  };
  author: {
    id: string;
    name: string;
    email: string;
  };
}
