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
  description: string | null;
  createdAt: Date | string;
  author: Author;
}

export interface Post {
  id: string;
  content: string;
  createdAt: Date | string; // ISO string
  author: Author;
}

export interface ForumThreadDetailAPI {
  id: string;
  title: string;
  createdAt: Date | string; // ISO string
  author: Author;
  posts: Post[];
}
