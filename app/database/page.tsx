"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Win } from "@/app/components/Win"

type FeedItem =
  | { type: "photo"; id: string; image_url: string; created_at: string }
  | { type: "note"; id: string; title: string; content: string; created_at: string }

export default function Database() {
  const router = useRouter()
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeed()
  }, [])

  async function fetchFeed() {
    const [photosRes, notesRes] = await Promise.all([
      supabase.from("photos").select("*"),
      supabase.from("notes").select("*"),
    ])

    const photos: FeedItem[] = (photosRes.data || []).map((p) => ({
      type: "photo" as const,
      ...p,
    }))
    const notes: FeedItem[] = (notesRes.data || []).map((n) => ({
      type: "note" as const,
      ...n,
    }))

    const combined = [...photos, ...notes].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    setFeed(combined)
    setLoading(false)
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center p-2"
      style={{
        background: "repeating-linear-gradient(90deg, #d4d4d4 0px, #d4d4d4 2px, #c4c4c4 2px, #c4c4c4 4px)",
      }}
    >
      <div
        className="flex w-full max-w-[390px] flex-col overflow-hidden"
        style={{
          height: "min(844px, 100dvh - 16px)",
          background: "#d0d0d0",
          fontFamily: "var(--font-pixel), monospace",
          border: "2px solid #888",
        }}
      >
        {/* Menu bar */}
        <div
          className="flex items-center gap-3 px-2 py-[5px] shrink-0"
          style={{ background: "#e8e8e8", borderBottom: "2px solid #888" }}
        >
          <span className="text-[7px]" style={{ color: "#333" }}>File</span>
          <span className="text-[7px]" style={{ color: "#333" }}>Edit</span>
          <span className="text-[7px]" style={{ color: "#333" }}>View</span>
          <span className="text-[7px]" style={{ color: "#333" }}>Special</span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-2">
          <Win title="database_feed.exe">
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => router.push("/")}
                className="py-1.5 px-3 text-[7px] uppercase"
                style={{
                  border: "2px solid #888",
                  background: "#e8e8e8",
                  color: "#333",
                  boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                }}
              >
                back
              </button>
              <button
                onClick={fetchFeed}
                className="flex-1 py-1.5 text-[7px] uppercase"
                style={{
                  border: "2px solid #888",
                  background: "#e8e8e8",
                  color: "#333",
                  boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                }}
              >
                refresh
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(100dvh - 200px)" }}>
              {loading ? (
                <p className="text-[6px] py-4 text-center" style={{ color: "#888" }}>
                  Loading...
                </p>
              ) : feed.length === 0 ? (
                <p className="text-[6px] py-4 text-center" style={{ color: "#888" }}>
                  No entries yet. Add photos or notes first.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {feed.map((item) => (
                    <div
                      key={item.id}
                      className="p-1.5"
                      style={{ border: "1px solid #bbb", background: "#f0f0f0" }}
                    >
                      {item.type === "photo" ? (
                        <>
                          <p className="text-[5px] uppercase mb-1" style={{ color: "#999" }}>
                            photo
                          </p>
                          <div
                            style={{
                              border: "2px solid #888",
                              background: "#e8e8e8",
                              overflow: "hidden",
                              maxHeight: 120,
                            }}
                          >
                            <img
                              src={item.image_url}
                              alt=""
                              className="w-full object-cover"
                              style={{ imageRendering: "auto", maxHeight: 120 }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-[5px] uppercase mb-0.5" style={{ color: "#999" }}>
                            note
                          </p>
                          <p className="text-[7px]" style={{ color: "#333" }}>
                            {item.title}
                          </p>
                          {item.content && (
                            <p className="text-[6px] mt-0.5" style={{ color: "#666" }}>
                              {item.content.length > 100 ? item.content.slice(0, 100) + "..." : item.content}
                            </p>
                          )}
                        </>
                      )}
                      <p className="text-[5px] mt-1" style={{ color: "#aaa" }}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Win>
        </div>

        {/* Taskbar */}
        <div
          className="flex items-center justify-between px-2 py-[5px] shrink-0"
          style={{ background: "#e0e0e0", borderTop: "2px solid #888" }}
        >
          <button
            onClick={() => router.push("/")}
            className="px-2 py-[2px] text-[6px]"
            style={{
              border: "2px solid #888",
              background: "#e8e8e8",
              color: "#333",
              boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
            }}
          >
            Start
          </button>
          <div
            className="px-2 py-[2px] text-[5px]"
            style={{ border: "1px solid #999", background: "#fff", color: "#444" }}
          >
            database.exe
          </div>
          <span className="text-[5px]" style={{ color: "#666" }}>
            {feed.length} items
          </span>
        </div>
      </div>
    </main>
  )
}
