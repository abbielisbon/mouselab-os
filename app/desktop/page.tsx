"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"


/* Reusable window component */
function Win({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "2px solid #7a8a9e",
        background: "#f0f4f8",
        boxShadow: "1px 1px 0 #5a6a7e, inset 1px 1px 0 #e8eef6",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-2 py-[4px]"
        style={{
          background: "linear-gradient(180deg, #6b8db5 0%, #4a7199 100%)",
          borderBottom: "2px solid #7a8a9e",
        }}
      >
        <span className="text-[7px]" style={{ color: "#fff", textShadow: "0 1px 0 rgba(0,0,0,0.3)" }}>{title}</span>
        <div className="flex gap-1">
          <div style={{
            width: 9, height: 9,
            background: "linear-gradient(180deg, #dce4ee, #b8c4d4)",
            border: "1px solid #7a8a9e",
            boxShadow: "inset 1px 1px 0 #fff",
          }} />
          <div style={{
            width: 9, height: 9,
            background: "linear-gradient(180deg, #dce4ee, #b8c4d4)",
            border: "1px solid #7a8a9e",
            boxShadow: "inset 1px 1px 0 #fff",
          }} />
        </div>
      </div>
      {/* Content */}
      <div className="p-2">{children}</div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [time, setTime] = useState(227)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cameraRef = useRef<HTMLInputElement | null>(null)
  const [snapping, setSnapping] = useState(false)

  async function handleSnap(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSnapping(true)
    const author = localStorage.getItem("mouselab-name") || "anonymous"
    const ext = file.name.split(".").pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from("photos").upload(path, file)
    if (error) {
      console.error("Upload failed:", error)
      alert("Upload failed: " + error.message)
      setSnapping(false)
      return
    }
    const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path)
    const { error: insertError } = await supabase.from("notes").insert({
      title: "Photo",
      content: "",
      author,
      image_url: urlData.publicUrl,
    })
    if (insertError) {
      console.error("Save failed:", insertError)
      alert("Save failed: " + insertError.message)
    }
    setSnapping(false)
    if (cameraRef.current) cameraRef.current.value = ""
  }

  useEffect(() => {
    if (running && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((t) => {
          if (t <= 1) {
            setRunning(false)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, time])

  function play() {
    if (time === 0) setTime(227)
    setRunning(true)
  }
  function pause() { setRunning(false) }
  function stop() { setRunning(false); setTime(227) }

  const mins = String(Math.floor(time / 60)).padStart(2, "0")
  const secs = String(time % 60).padStart(2, "0")
  const progress = ((227 - time) / 227) * 100

  return (
    <main
      className="flex min-h-screen items-center justify-center p-2"
      style={{
        background: "linear-gradient(135deg, #b8c8d8 0%, #c8d4e2 40%, #d0dae8 100%)",
      }}
    >
      {/* iPhone-sized OS desktop */}
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
        </div>

        {/* Windows area */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-2">

          {/* About window */}
          <Win title="about_mouselab.txt">
            <p className="text-[7px] leading-relaxed" style={{ color: "#3a4a5a" }}>
              Cultural Intelligence Lab - Rodent Research
            </p>
            <p className="mt-1 text-[6px]" style={{ color: "#7a8a9e" }}>
              Three Blind Mice Division 2A Observation Deck
            </p>
          </Win>

          {/* Observation deck window */}
          <Win title="observation_deck.exe">
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSnap}
            />
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => cameraRef.current?.click()}
                disabled={snapping}
                className="py-1.5 text-[7px] uppercase"
                style={{
                  border: "2px solid #7a8a9e",
                  background: "#dce4ee",
                  color: "#3a4a5a",
                  boxShadow: "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
                }}
              >
                {snapping ? "saving..." : "upload image"}
              </button>
              <button
                onClick={() => router.push("/post")}
                className="py-1.5 text-[7px] uppercase"
                style={{
                  border: "2px solid #7a8a9e",
                  background: "#dce4ee",
                  color: "#3a4a5a",
                  boxShadow: "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
                }}
              >
                post
              </button>
            </div>
            <button
              onClick={() => router.push("/database")}
              className="mt-1.5 w-full py-1.5 text-[6px] uppercase"
              style={{
                border: "2px solid #7a8a9e",
                background: "#dce4ee",
                color: "#3a4a5a",
                boxShadow: "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
              }}
            >
              View Database
            </button>
          </Win>

          {/* Music player window */}
          <Win title="mouselab_player.mp3">
            <p className="text-[5px] uppercase" style={{ color: "#8a9aae" }}>Now playing</p>
            <p className="text-[7px]" style={{ color: "#3a4a5a" }}>Turn My Swag On — {mins}:{secs}</p>
            <div className="mt-1.5 mb-1" style={{ border: "2px solid #7a8a9e", background: "#e0e6ee", height: 8 }}>
              <div
                className="h-full transition-all duration-1000"
                style={{ width: `${progress}%`, background: "#7a8a9e" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[6px]" style={{ color: "#7a8a9e" }}>{mins}:{secs} / 3:47</span>
              <div className="flex gap-1">
                <button
                  onClick={stop}
                  className="px-2 py-1 text-[7px]"
                  style={{
                    border: "2px solid #7a8a9e",
                    background: "#dce4ee",
                    color: "#3a4a5a",
                    boxShadow: "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
                  }}
                >
                  ⏮
                </button>
                <button
                  onClick={running ? pause : play}
                  className="px-2 py-1 text-[7px]"
                  style={{
                    border: "2px solid #7a8a9e",
                    background: running ? "#b8c4d4" : "#dce4ee",
                    color: "#3a4a5a",
                    boxShadow: running
                      ? "inset 1px 1px 0 #8a9aae, inset -1px -1px 0 #ddd"
                      : "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
                  }}
                >
                  {running ? "⏸" : "▶"}
                </button>
                <button
                  onClick={stop}
                  className="px-2 py-1 text-[7px]"
                  style={{
                    border: "2px solid #7a8a9e",
                    background: "#dce4ee",
                    color: "#3a4a5a",
                    boxShadow: "inset -1px -1px 0 #8a9aae, inset 1px 1px 0 #fff",
                  }}
                >
                  ⏭
                </button>
              </div>
            </div>
          </Win>

          {/* Mouse screensaver window */}
          <Win title="mouse_display.scr">
            <div
              className="relative overflow-hidden"
              style={{ height: 62, width: "100%", background: "#002a10", borderRadius: 2 }}
            >
              {/* Cheese wedge */}
              <div className="absolute cheese-chomp" style={{ right: 10, top: 35 }}>
                <div className="grid grid-cols-7 gap-0" style={{ width: 21, height: 24 }}>
                  {[
                    0,0,0,0,0,0,1,
                    0,0,0,0,0,1,1,
                    0,0,0,0,1,1,1,
                    0,0,0,1,1,1,1,
                    0,0,1,1,0,1,1,
                    0,1,1,1,1,1,1,
                    1,1,0,1,1,1,1,
                    1,1,1,1,1,1,1,
                  ].map((p, i) => (
                    <div key={i} style={{ width: 3, height: 3, background: p ? "#33ff66" : "transparent" }} />
                  ))}
                </div>
              </div>

              {/* Mouse scurrying */}
              <div
                className="absolute"
                style={{
                  top: 32,
                  left: 0,
                  animation: "mouseScurry 1.65s linear infinite",
                  zIndex: 2,
                }}
              >
                <div className="relative mouse-skitter" style={{ width: 84, height: 30 }}>
                  <div className="absolute mouse-tail-pixels" style={{ left: 0, top: 16 }}>
                    <div className="grid gap-0" style={{ width: 18, height: 9, gridTemplateColumns: "repeat(6, 3px)" }}>
                      {[
                        0,0,0,1,0,0,
                        1,1,1,1,0,0,
                        0,0,1,1,1,1,
                      ].map((p, i) => (
                        <div key={i} style={{ width: 3, height: 3, background: p ? "#33ff66" : "transparent" }} />
                      ))}
                    </div>
                  </div>

                  <div className="absolute" style={{ left: 12, top: 6 }}>
                    <div className="grid gap-0" style={{ width: 60, height: 24, gridTemplateColumns: "repeat(20, 3px)" }}>
                      {[
                        0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,
                        0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,0,0,0,
                        0,0,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,
                        0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
                        0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                        0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
                        0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
                        0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,
                      ].map((p, i) => (
                        <div key={i} style={{ width: 3, height: 3, background: p ? "#33ff66" : "transparent" }} />
                      ))}
                    </div>
                  </div>

                  <div className="absolute mouse-foot-flicker" style={{ left: 34, top: 27, width: 6, height: 3, background: "#33ff66" }} />
                  <div className="absolute mouse-foot-flicker" style={{ left: 49, top: 27, width: 6, height: 3, background: "#33ff66", animationDelay: "-0.09s" }} />
                </div>
              </div>

              {/* Ground line */}
              <div className="absolute bottom-0 left-0 right-0" style={{ height: 3, background: "#33ff66" }} />
            </div>
            <div style={{ background: "#002a10", padding: "4px 0" }}>
              <p className="text-[5px] text-center" style={{ color: "#33ff66", textShadow: "0 0 4px rgba(51,255,102,0.4)" }}>
                MOUSE_DISPLAY.SCR — ACTIVE
              </p>
            </div>
          </Win>

        </div>

        {/* Taskbar */}
        <div
          className="flex items-center justify-between px-2 py-[5px] shrink-0"
          style={{ background: "#d0d8e6", borderTop: "2px solid #7a8a9e" }}
        >
          <button
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
          <div className="flex gap-1">
            <div
              className="px-2 py-[2px] text-[5px]"
              style={{ border: "1px solid #8a9aae", background: "#f0f4f8", color: "#4a5a6a" }}
            >
              mouselab.exe
            </div>
          </div>
          <span className="text-[5px]" style={{ color: "#7a8a9e" }}>
            {mins}:{secs}
          </span>
        </div>
      </div>
    </main>
  )
}
