import React from "react"

type Node =
  | { type: "paragraph"; content?: Node[] }
  | { type: "text"; text: string }
  | { type: "heading"; attrs?: { level?: number }; content?: Node[] }
  | { type: "blockquote"; content?: Node[] }
  | { type: "bulletList"; content?: Node[] }
  | { type: "orderedList"; content?: Node[] }
  | { type: "listItem"; content?: Node[] }
  | { type: "image"; attrs?: { src: string; alt?: string } }
  | { type: string; [key: string]: any }

type JSONDoc = { type: string; content?: Node[] }

export function RichTextRenderer({ contentJson }: { contentJson: string }) {
  let parsed: JSONDoc | null = null

  try {
    parsed = JSON.parse(contentJson)
  } catch {
    parsed = null
  }

  if (!parsed) {
    // Treat as HTML
    return (
      <div
        className="prose prose-neutral max-w-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: contentJson }}
      />
    )
  }

  return <div className="prose prose-neutral max-w-none leading-relaxed">{renderNodes(parsed.content || [])}</div>
}

function renderNodes(nodes: Node[] = []): React.ReactNode {
  return nodes.map((node, idx) => {
    switch (node.type) {
      case "text":
        // @ts-ignore
        return <React.Fragment key={idx}>{node.text}</React.Fragment>

      case "paragraph":
        return <p key={idx}>{renderNodes((node as any).content || [])}</p>

      case "heading": {
        const level = Math.min(Math.max((node as any).attrs?.level ?? 2, 1), 6)
        const Tag = `h${level}` as any
        return <Tag key={idx}>{renderNodes((node as any).content || [])}</Tag>
      }

      case "blockquote":
        return <blockquote key={idx}>{renderNodes((node as any).content || [])}</blockquote>

      case "bulletList":
        return (
          <ul key={idx} className="list-disc pl-6">
            {renderNodes((node as any).content || [])}
          </ul>
        )

      case "orderedList":
        return (
          <ol key={idx} className="list-decimal pl-6">
            {renderNodes((node as any).content || [])}
          </ol>
        )

      case "listItem":
        return <li key={idx}>{renderNodes((node as any).content || [])}</li>

      case "image": {
        const { src, alt } = (node as any).attrs || {}
        if (!src) return null
        return (
          <img key={idx} src={src || "/placeholder.svg"} alt={alt || ""} className="my-4 rounded-lg w-full h-auto" />
        )
      }

      default:
        // Unknown node type: render its children if any
        // @ts-ignore
        return <div key={idx}>{renderNodes(node.content || [])}</div>
    }
  })
}
