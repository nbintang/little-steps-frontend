"use client"

import useSWR from "swr"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThreadCard } from "./thread-card"
import type { ForumThreadListItem } from "@/types/forum"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ForumListClient({ initial }: { initial: ForumThreadListItem[] }) {
  const { data, isValidating, mutate } = useSWR<ForumThreadListItem[]>("/api/forum", fetcher, {
    fallbackData: initial,
  })
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data || []
    return (data || []).filter((t) => t.title.toLowerCase().includes(q) || t.author.name.toLowerCase().includes(q))
  }, [data, query])

  return (
    <section aria-labelledby="forum-heading" className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <h2 id="forum-heading" className="text-xl font-semibold">
            Forum
          </h2>
          {isValidating ? <span className="text-xs text-muted-foreground">(updating…)</span> : null}
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <Input
            placeholder="Search threads by title or author"
            aria-label="Search threads"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="secondary" onClick={() => setQuery("")} aria-label="Clear search">
            Clear
          </Button>
          <Button onClick={() => mutate()} aria-label="Refresh threads">
            Refresh
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((t) => (
          <ThreadCard key={t.id} thread={t} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No threads found. Try a different search.</p>
      )}

      <div className="pt-4">
        <Link href="/" className="text-sm text-primary underline underline-offset-4">
          Back to Home
        </Link>
      </div>
    </section>
  )
}
