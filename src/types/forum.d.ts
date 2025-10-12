import { CategoryPublicAPI } from "./category";

export interface Author {
  id: string;
  name: string;
  profile: {
    avatarUrl?: string;
  };
}

export interface ForumThreadListItemAPI {
  id: string;
  title: string;
  description: string;
  postCount: number;
  createdAt: Date | string;
  category: CategoryPublicAPI;
  author: Author;
}

export interface PostAPI {
  id: string;
  content: string;
  createdAt: Date | string; // ISO string
  author: Author;
  isEdited: boolean;
}

export interface ForumThreadDetailAPI {
  id: string;
  title: string;
  description: string;
  createdAt: Date | string; // ISO string
  author: Author;
  posts: PostAPI[];
  category: CategoryPublicAPI;
  isEdited: boolean;
}
