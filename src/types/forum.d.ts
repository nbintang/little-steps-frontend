export interface Author {
  id: string
  name: string
  avatarUrl?: string
}

export interface ForumThreadListItem {
  id: string
  title: string
  createdAt: string 
  author: Author
}

export interface Post {
  id: string
  content: string
  createdAt: string // ISO string
  author: Author
}

export interface ForumThreadDetail {
  id: string
  title: string
  createdAt: string // ISO string
  author: Author
  posts: Post[]
}
