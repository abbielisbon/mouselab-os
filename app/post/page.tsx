"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Win } from "@/app/components/Win"

export default function Post() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [author, setAuthor] = useState("")

  useEffect(() => {
    setAuthor(localStorage.getItem("mouselab-name") || "anonymous")
  }, [])

  async function handlePost() {
    if (!title.trim() && !content.trim() && !file) return
    setSaving(true)

    let image_url: string | undefined

    if (file) {
      const ext = file.name.split(".").pop()
      const path = `${Date.now()}.${ext}`
      const { error } = await supabase.storage.from("photos").upload(path, file)
      if (!error) {
        const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path)
        image_url = urlData.publicUrl
      }
    }

    const { error: insertError } = await supabase.from("notes").insert({
      title: title.trim() || "Untitled",
      content: content.trim(),
      author,
      image_url,
    })

    if (insertError) {
      console.error("Post failed:", insertError)
      alert("Post failed: " + insertError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    router.push("/desktop")
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center p-2"
      style={{
        background: "repeating-linear-gradient(90deg, #cdd8e6 0px, #cdd8e6 2px, #c0ccda 2px, #c0ccda 4px)",
      }}
    >
      <div
        className="flex w-full max-w-[390px] flex-col overflow-hidden"
        style={{
          height: "min(844px, 100dvh - 16px)",
          background: "#cdd8e6",
          fontFamily: "var(--font-pixel), monospace",
          border: "2px solid #888",
        }}
      >
        {/* Menu bar */}
        <div
          className="flex items-center gap-3 px-2 py-[5px] shrink-0"
          style={{ background: "#dce4ee", borderBottom: "2px solid #888" }}
        >
          <span className="text-[7px]" style={{ color: "#333" }}>File</span>
          <span className="text-[7px]" style={{ color: "#333" }}>Edit</span>
          <span className="text-[7px]" style={{ color: "#333" }}>View</span>
          <span className="text-[7px]" style={{ color: "#333" }}>Special</span>
          <button
            onClick={() => router.push("/desktop")}
            className="ml-auto flex items-center justify-center text-[7px]"
            style={{
              width: 14,
              height: 14,
              background: "#c5d0de",
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
          <Win title="new_post.exe">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="title..."
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
              placeholder="write your post..."
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

            {/* Photo attachment */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full mt-1 py-1.5 text-[7px] uppercase"
              style={{
                border: "2px solid #888",
                background: file ? "#b8c4d4" : "#dce4ee",
                color: "#333",
                boxShadow: file
                  ? "inset 1px 1px 0 #999, inset -1px -1px 0 #ddd"
                  : "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
              }}
            >
              {file ? file.name : "attach photo (optional)"}
            </button>

            <div className="flex gap-1 mt-1">
              <button
                onClick={handlePost}
                disabled={saving}
                className="flex-1 py-1.5 text-[7px] uppercase"
                style={{
                  border: "2px solid #888",
                  background: "#dce4ee",
                  color: "#333",
                  boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                }}
              >
                {saving ? "posting..." : "post"}
              </button>
              <button
                onClick={() => router.push("/desktop")}
                className="py-1.5 px-3 text-[7px] uppercase"
                style={{
                  border: "2px solid #888",
                  background: "#dce4ee",
                  color: "#333",
                  boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                }}
              >
                back
              </button>
            </div>
          </Win>
        </div>

        {/* Taskbar */}
        <div
          className="flex items-center justify-between px-2 py-[5px] shrink-0"
          style={{ background: "#d6deea", borderTop: "2px solid #888" }}
        >
          <button
            onClick={() => router.push("/desktop")}
            className="px-2 py-[2px] text-[6px]"
            style={{
              border: "2px solid #888",
              background: "#dce4ee",
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
            new_post.exe
          </div>
          <span className="text-[5px]" style={{ color: "#666" }}>
            {author}
          </span>
        </div>
      </div>
    </main>
  )
}
