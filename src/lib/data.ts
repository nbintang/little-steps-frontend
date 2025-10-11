import type { Root } from "./types"

const now = new Date()

const demoAuthor = {
  id: "u1",
  name: "Alex Writer",
  email: "alex@example.com",
  profile: { avatarUrl: "/author-avatar.jpg" },
}

const catTech = { id: "c1", slug: "technology", name: "Technology" }
const catSciFi = { id: "c2", slug: "sci-fi", name: "Sci‑Fi" }

const demoParagraphs = (text: string) =>
  JSON.stringify({
    type: "doc",
    content: [
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text }] },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae metus eu metus venenatis feugiat. Integer at nulla eu odio aliquet placerat.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Suspendisse potenti. Quisque efficitur, urna id mattis facilisis, augue metus finibus augue, vel bibendum augue nunc in lectus.",
          },
        ],
      },
    ],
  })

const ALL_CONTENT: Root[] = [
  // Articles
  {
    id: "a1",
    slug: "the-future-of-web-ux",
    title: "The Future of Web UX",
    type: "ARTICLE",
    coverImage: "/landscape-cover-ux.jpg",
    excerpt: "Exploring trends that shape the next decade of user experience on the web.",
    status: "PUBLISHED",
    rating: 0,
    contentJson: demoParagraphs("Design Systems at Scale"),
    author: demoAuthor,
    category: catTech,
    createdAt: new Date(now.getTime() - 1000 * 3600 * 24 * 10).toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "a2",
    slug: "edge-compute-patterns",
    title: "Edge Compute Patterns",
    type: "ARTICLE",
    coverImage: "/edge-compute-patterns.jpg",
    excerpt: "How to model apps for latency-sensitive workloads at the edge.",
    status: "PUBLISHED",
    rating: 0,
    contentJson: demoParagraphs("Latency and Architecture"),
    author: demoAuthor,
    category: catTech,
    createdAt: new Date(now.getTime() - 1000 * 3600 * 24 * 30).toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "a3",
    slug: "accessible-components-checklist",
    title: "Accessible Components Checklist",
    type: "ARTICLE",
    coverImage: "/accessibility-components.jpg",
    excerpt: "A practical checklist for building accessible UI components.",
    status: "PUBLISHED",
    rating: 0,
    contentJson: demoParagraphs("Inclusive Design"),
    author: demoAuthor,
    category: catTech,
    createdAt: new Date(now.getTime() - 1000 * 3600 * 24 * 60).toISOString(),
    updatedAt: now.toISOString(),
  },

  // Fictions
  {
    id: "f1",
    slug: "starfarer-chronicles",
    title: "Starfarer Chronicles",
    type: "FICTION_STORY",
    coverImage: "/portrait-space-story.jpg",
    excerpt: "A lone navigator traverses silent nebulae in search of a forgotten signal.",
    status: "PUBLISHED",
    rating: 4.7,
    contentJson: demoParagraphs("Arrival at the Nebula Gate"),
    author: demoAuthor,
    category: catSciFi,
    createdAt: new Date(now.getTime() - 1000 * 3600 * 24 * 5).toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "f2",
    slug: "the-clockmakers-oath",
    title: "The Clockmaker’s Oath",
    type: "FICTION_STORY",
    coverImage: "/portrait-clockmaker.jpg",
    excerpt: "A craftsman discovers time is a labyrinth built on promises.",
    status: "PUBLISHED",
    rating: 4.4,
    contentJson: demoParagraphs("Gears and Whispers"),
    author: demoAuthor,
    category: catSciFi,
    createdAt: new Date(now.getTime() - 1000 * 3600 * 24 * 20).toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "f3",
    slug: "echoes-of-the-deep",
    title: "Echoes of the Deep",
    type: "FICTION_STORY",
    coverImage: "/portrait-undersea.jpg",
    excerpt: "Beneath the waves, memory becomes a map with a mind of its own.",
    status: "PUBLISHED",
    rating: 4.9,
    contentJson: demoParagraphs("Currents of Memory"),
    author: demoAuthor,
    category: catSciFi,
    createdAt: new Date(now.getTime() - 1000 * 3600 * 24 * 90).toISOString(),
    updatedAt: now.toISOString(),
  },
]

export async function getArticles() {
  return ALL_CONTENT.filter((c) => c.type === "ARTICLE").map(stripToDisplayFields)
}

export async function getFictions() {
  return ALL_CONTENT.filter((c) => c.type === "FICTION_STORY").map(stripToDisplayFields)
}

export async function getArticleBySlug(slug: string) {
  const found = ALL_CONTENT.find((c) => c.type === "ARTICLE" && c.slug === slug)
  return found ? stripToDisplayFields(found) : undefined
}

export async function getFictionBySlug(slug: string) {
  const found = ALL_CONTENT.find((c) => c.type === "FICTION_STORY" && c.slug === slug)
  return found ? stripToDisplayFields(found) : undefined
}

function stripToDisplayFields(item: Root) {
  // Only return the fields the UI will display
  return {
    slug: item.slug,
    title: item.title,
    coverImage: item.coverImage,
    excerpt: item.excerpt,
    category: item.category,
    createdAt: item.createdAt,
    author: item.author,
    rating: item.rating,
    contentJson: item.contentJson,
    type: item.type,
  }
}

export type DisplayItem = ReturnType<typeof stripToDisplayFields>
