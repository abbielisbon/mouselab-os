"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Win } from "@/app/components/Win"

export default function Notes() {
  const router = useRouter()
  const [notes, setNotes] = useState<{ id: string; title: string; content: string; author?: string; created_at: string }[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [author, setAuthor] = useState("")

  useEffect(() => {
    setAuthor(localStorage.getItem("mouselab-name") || "anonymous")
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
      author,
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
        background: "linear-gradient(135deg, #b8c8d8 0%, #c8d4e2 40%, #d0dae8 100%)",
      }}
    >
      <div
        className="flex w-full max-w-[390px] flex-col overflow-hidden"
        style={{
          height: "min(844px, 100dvh - 16px)",
          background: "linear-gradient(180deg, #d4dfed 0%, #c8d4e4 100%)",
          fontFamily: "var(--font-pixel), monospace",
          border: "2px solid #7a8a9e",
          boxShadow: "2px 2px 0 rgba(0,0,0,0.15), inset 1px 1px 0 #e8eef6",
        }}
      >
        {/* Menu bar */}
        <div
          className="flex items-center gap-3 px-2 py-[5px] shrink-0"
          style={{
            background: "linear-gradient(180deg, #e8eef6 0%, #d8e0ec 100%)",
            borderBottom: "2px solid #7a8a9e",
          }}
        >
          <span className="text-[7px]" style={{ color: "#3a4a5a" }}>File</span>
          <span className="text-[7px]" style={{ color: "#3a4a5a" }}>Edit</span>
          <span className="text-[7px]" style={{ color: "#3a4a5a" }}>View</span>
          <span className="text-[7px]" style={{ color: "#3a4a5a" }}>Special</span>
          <button
            onClick={() => router.push("/desktop")}
            className="ml-auto flex items-center justify-center text-[7px]"
            style={{
              width: 14,
              height: 14,
              background: "#c5d0de",
              border: "1px solid #7a8a9e",
              color: "#3a4a5a",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
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
              placeholder="title..."
              className="w-full mb-1 px-1 py-1 text-[7px]"
              style={{
                border: "2px solid #7a8a9e",
                background: "#fff",
                color: "#3a4a5a",
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
                border: "2px solid #7a8a9e",
                background: "#fff",
                color: "#3a4a5a",
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
                  border: "2px solid #7a8a9e",
                  background: "#dce4ee",
                  color: "#3a4a5a",
                  boxShadow: "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
                }}
              >
                {saving ? "saving..." : "save entry"}
              </button>
              <button
                onClick={() => router.push("/desktop")}
                className="py-1.5 px-3 text-[7px] uppercase"
                style={{
                  border: "2px solid #7a8a9e",
                  background: "#dce4ee",
                  color: "#3a4a5a",
                  boxShadow: "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
                }}
              >
                back
              </button>
            </div>
          </Win>

          <Win title="journal.log">
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100dvh - 360px)" }}>
              {notes.length === 0 ? (
                <p className="text-[6px] py-4 text-center" style={{ color: "#8a9aae" }}>
                  No notes yet. Write one above.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-1.5"
                      style={{ border: "1px solid #b8c4d4", background: "#f0f4f8" }}
                    >
                      <p className="text-[5px] mb-0.5" style={{ color: "#8a9aae" }}>
                        {note.author || "anonymous"}
                      </p>
                      <p className="text-[7px] font-bold" style={{ color: "#3a4a5a" }}>
                        {note.title}
                      </p>
                      {note.content && (
                        <p className="text-[6px] mt-0.5" style={{ color: "#5a6a7e" }}>
                          {note.content.length > 120 ? note.content.slice(0, 120) + "..." : note.content}
                        </p>
                      )}
                      <p className="text-[5px] mt-1" style={{ color: "#a0aab8" }}>
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
          style={{ background: "#d0d8e6", borderTop: "2px solid #7a8a9e" }}
        >
          <button
            onClick={() => router.push("/desktop")}
            className="px-2 py-[2px] text-[6px]"
            style={{
              border: "2px solid #7a8a9e",
              background: "#dce4ee",
              color: "#3a4a5a",
              boxShadow: "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
            }}
          >
            Start
          </button>
          <div
            className="px-2 py-[2px] text-[5px]"
            style={{ border: "1px solid #8a9aae", background: "#f0f4f8", color: "#4a5a6a" }}
          >
            notes.exe
          </div>
          <span className="text-[5px]" style={{ color: "#7a8a9e" }}>
            {notes.length} entries
          </span>
        </div>
      </div>
    </main>
  )
}
