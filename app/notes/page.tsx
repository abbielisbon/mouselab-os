"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Win } from "@/app/components/Win"

export default function Notes() {
  const router = useRouter()
  const [notes, setNotes] = useState<{ id: string; title: string; content: string; created_at: string }[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setNotes(data)
  }

  async function handleSave() {
    if (!title.trim() && !content.trim()) return
    setSaving(true)
    await supabase.from("notes").insert({
      title: title.trim() || "Untitled",
      content: content.trim(),
    })
    setTitle("")
    setContent("")
    await fetchNotes()
    setSaving(false)
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
          <button
            onClick={() => router.push("/")}
            className="ml-auto flex items-center justify-center text-[7px]"
            style={{
              width: 14,
              height: 14,
              background: "#ccc",
              border: "1px solid #888",
              color: "#333",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-2">
          <Win title="new_entry.txt">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="name..."
              className="w-full mb-1 px-1 py-1 text-[7px]"
              style={{
                border: "2px solid #888",
                background: "#fff",
                color: "#333",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="write your note..."
              className="w-full px-1 py-1 text-[7px] resize-none"
              rows={4}
              style={{
                border: "2px solid #888",
                background: "#fff",
                color: "#333",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            <div className="flex gap-1 mt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-1.5 text-[7px] uppercase"
                style={{
                  border: "2px solid #888",
                  background: "#e8e8e8",
                  color: "#333",
                  boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                }}
              >
                {saving ? "saving..." : "save entry"}
              </button>
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
            </div>
          </Win>

          <Win title="journal.log">
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100dvh - 360px)" }}>
              {notes.length === 0 ? (
                <p className="text-[6px] py-4 text-center" style={{ color: "#888" }}>
                  No notes yet. Write one above.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-1.5"
                      style={{ border: "1px solid #bbb", background: "#f0f0f0" }}
                    >
                      <p className="text-[7px] font-bold" style={{ color: "#333" }}>
                        {note.title}
                      </p>
                      {note.content && (
                        <p className="text-[6px] mt-0.5" style={{ color: "#666" }}>
                          {note.content.length > 120 ? note.content.slice(0, 120) + "..." : note.content}
                        </p>
                      )}
                      <p className="text-[5px] mt-1" style={{ color: "#aaa" }}>
                        {new Date(note.created_at).toLocaleDateString()}
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
            notes.exe
          </div>
          <span className="text-[5px]" style={{ color: "#666" }}>
            {notes.length} entries
          </span>
        </div>
      </div>
    </main>
  )
}
