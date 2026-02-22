"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Win } from "@/app/components/Win"

export default function CameraRoll() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [photos, setPhotos] = useState<{ id: string; image_url: string; created_at: string }[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
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

    await supabase.from("photos").insert({ image_url: urlData.publicUrl })
    await fetchPhotos()
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ""
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
                border: "2px solid #888",
                background: "#e8e8e8",
                color: "#333",
                boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
              }}
            >
              {uploading ? "uploading..." : "upload photo"}
            </button>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(100dvh - 220px)" }}>
              {photos.length === 0 ? (
                <p className="text-[6px] py-4 text-center" style={{ color: "#888" }}>
                  No photos yet. Upload one above.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-1">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      style={{
                        border: "2px solid #888",
                        background: "#e8e8e8",
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
            camera_roll.exe
          </div>
          <span className="text-[5px]" style={{ color: "#666" }}>
            {photos.length} photos
          </span>
        </div>
      </div>
    </main>
  )
}
