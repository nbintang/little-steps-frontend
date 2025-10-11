export type ContentAPI = {
  id: string
  slug: string
  title: string
  type: "ARTICLE" | "FICTION_STORY"
  coverImage: string
  excerpt: string
  status: "PUBLISHED"
  contentJson: string
  category: {
    id: string
    slug: string
    name: string
  } | null
  createdAt: string
  updatedAt: string
}

export type Root = {
  id: string
  slug: string
  title: string
  type: string
  coverImage: string
  excerpt: string
  status: string
  rating: number
  contentJson: string
  author: {
    id: string
    name: string
    email: string
    profile: {
      avatarUrl: string
    }
  }
  category: {
    id: string
    slug: string
    name: string
  }
  createdAt: string
  updatedAt: string
}
