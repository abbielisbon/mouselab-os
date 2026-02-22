"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Win } from "@/app/components/Win"

export default function CameraRoll() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [photos, setPhotos] = useState<{ id: string; image_url: string; author?: string; created_at: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [author, setAuthor] = useState("")

  useEffect(() => {
    setAuthor(localStorage.getItem("mouselab-name") || "anonymous")
    fetchPhotos()
  }, [])

  async function fetchPhotos() {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setPhotos(data)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split(".").pop()
    const path = `${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(path, file)

    if (uploadError) {
      console.error(uploadError)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(path)

    await supabase.from("photos").insert({ image_url: urlData.publicUrl, author })
    await fetchPhotos()
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ""
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
          <Win title="camera_roll.exe">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full py-1.5 mb-1.5 text-[7px] uppercase"
              style={{
                border: "2px solid #7a8a9e",
                background: "#dce4ee",
                color: "#3a4a5a",
                boxShadow: "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
              }}
            >
              {uploading ? "uploading..." : "upload photo"}
            </button>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(100dvh - 220px)" }}>
              {photos.length === 0 ? (
                <p className="text-[6px] py-4 text-center" style={{ color: "#8a9aae" }}>
                  No photos yet. Upload one above.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-1">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      style={{
                        border: "2px solid #7a8a9e",
                        background: "#e0e6ee",
                        aspectRatio: "1",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={photo.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ imageRendering: "auto" }}
                      />
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
            camera_roll.exe
          </div>
          <span className="text-[5px]" style={{ color: "#7a8a9e" }}>
            {photos.length} photos
          </span>
        </div>
      </div>
    </main>
  )
}
