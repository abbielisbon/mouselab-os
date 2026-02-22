"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"


/* Reusable window component */
function Win({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "2px solid #888", background: "#fff" }}>
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-2 py-[3px]"
        style={{ background: "#e0e0e0", borderBottom: "2px solid #888" }}
      >
        <span className="text-[7px]" style={{ color: "#333" }}>{title}</span>
        <div className="flex gap-1">
          <div style={{ width: 8, height: 8, background: "#ccc", border: "1px solid #888" }} />
          <div style={{ width: 8, height: 8, background: "#ccc", border: "1px solid #888" }} />
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
        background: "repeating-linear-gradient(90deg, #d4d4d4 0px, #d4d4d4 2px, #c4c4c4 2px, #c4c4c4 4px)",
      }}
    >
      {/* iPhone-sized OS desktop */}
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
          <span className="ml-auto text-[6px]" style={{ color: "#666" }}>{mins}:{secs}</span>
        </div>

        {/* Desktop icon strip */}
        <div className="flex justify-center gap-4 px-3 py-2 shrink-0">
          {[
            { icon: "◈", label: "About" },
            { icon: "✎", label: "Note" },
            { icon: "⚙", label: "Settings" },
            { icon: "▶", label: "Play" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <div
                className="flex items-center justify-center text-[12px]"
                style={{ width: 28, height: 28, background: "#e8e8e8", border: "2px solid #888", color: "#444" }}
              >
                {item.icon}
              </div>
              <span className="text-[5px]" style={{ color: "#444" }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Windows area */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 pb-2">

          {/* About window */}
          <Win title="about_mouselab.txt">
            <p className="text-[7px] leading-relaxed" style={{ color: "#444" }}>
              Cultural Intelligence Lab - Rodent Research
            </p>
            <p className="mt-1 text-[6px]" style={{ color: "#888" }}>
              Three Blind Mice Division 2A Observation Deck
            </p>
          </Win>

          {/* Mouse animation — green screen */}
          <Win title="mouse_display.scr">
              <div
                className="relative overflow-hidden"
                style={{ background: "#002a10", border: "2px inset #004400", height: 62 }}
              >
              {/* Cheese wedge — on ground */}
              <div className="absolute cheese-chomp" style={{ right: 10, top: 28 }}>
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

              {/* Fat plump mouse scurrying toward cheese with a little tail behind */}
              <div
                className="absolute"
                style={{
                  top: 23,
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

                  <div className="absolute" style={{ left: 60, top: 14, width: 3, height: 3, background: "#002a10" }} />
                  <div className="absolute mouse-foot-flicker" style={{ left: 34, top: 27, width: 6, height: 3, background: "#33ff66" }} />
                  <div className="absolute mouse-foot-flicker" style={{ left: 49, top: 27, width: 6, height: 3, background: "#33ff66", animationDelay: "-0.09s" }} />
                </div>
              </div>

              {/* Ground line */}
              <div className="absolute bottom-1 left-0 right-0" style={{ height: 3, background: "#1a8836" }} />
            </div>
          </Win>

          {/* Observation deck window */}
          <Win title="observation_deck.exe">
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => cameraRef.current?.click()}
                className="py-1.5 text-[7px] uppercase"
                style={{
                  border: "2px solid #888",
                  background: "#e8e8e8",
                  color: "#666",
                  boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                }}
              >
                photo
              </button>
              <button
                onClick={() => router.push("/camera-roll")}
                className="py-1.5 text-[6px] uppercase"
                style={{
                  border: "2px solid #888",
                  background: "#e8e8e8",
                  color: "#666",
                  boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                }}
              >
                camera roll
              </button>
              <button
                onClick={() => router.push("/notes")}
                className="py-1.5 text-[7px] uppercase"
                style={{
                  border: "2px solid #888",
                  background: "#e8e8e8",
                  color: "#666",
                  boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                }}
              >
                note
              </button>
            </div>
            <button
              onClick={() => router.push("/database")}
              className="mt-1.5 w-full py-1.5 text-[6px] uppercase"
              style={{
                border: "2px solid #888",
                background: "#e8e8e8",
                color: "#333",
                boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
              }}
            >
              View Database
            </button>
          </Win>

          {/* Music player window */}
          <Win title="mouselab_player.mp3">
            {/* Now playing */}
            <p className="text-[5px] uppercase" style={{ color: "#999" }}>Now playing</p>
            <p className="text-[7px]" style={{ color: "#333" }}>Turn My Swag On — {mins}:{secs}</p>

            {/* Scrubber */}
            <div className="mt-1.5 mb-1" style={{ border: "2px solid #888", background: "#e8e8e8", height: 8 }}>
              <div
                className="h-full transition-all duration-1000"
                style={{
                  width: `${progress}%`,
                  background: "#999",
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              {/* Time display */}
              <span className="text-[6px]" style={{ color: "#666" }}>{mins}:{secs} / 3:47</span>

              {/* Transport controls */}
              <div className="flex gap-1">
                <button
                  onClick={stop}
                  className="px-2 py-1 text-[7px]"
                  style={{
                    border: "2px solid #888",
                    background: "#e8e8e8",
                    color: "#333",
                    boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                  }}
                >
                  ⏮
                </button>
                <button
                  onClick={running ? pause : play}
                  className="px-2 py-1 text-[7px]"
                  style={{
                    border: "2px solid #888",
                    background: running ? "#bbb" : "#e8e8e8",
                    color: "#333",
                    boxShadow: running
                      ? "inset 1px 1px 0 #999, inset -1px -1px 0 #ddd"
                      : "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                  }}
                >
                  {running ? "⏸" : "▶"}
                </button>
                <button
                  onClick={stop}
                  className="px-2 py-1 text-[7px]"
                  style={{
                    border: "2px solid #888",
                    background: "#e8e8e8",
                    color: "#333",
                    boxShadow: "inset -1px -1px 0 #999, inset 1px 1px 0 #fff",
                  }}
                >
                  ⏭
                </button>
              </div>
            </div>
          </Win>
        </div>

        {/* Taskbar */}
        <div
          className="flex items-center justify-between px-2 py-[5px] shrink-0"
          style={{ background: "#e0e0e0", borderTop: "2px solid #888" }}
        >
          <button
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
          <div className="flex gap-1">
            <div
              className="px-2 py-[2px] text-[5px]"
              style={{ border: "1px solid #999", background: "#fff", color: "#444" }}
            >
              mouselab.exe
            </div>
          </div>
          <span className="text-[5px]" style={{ color: "#666" }}>
            {mins}:{secs}
          </span>
        </div>
      </div>
    </main>
  )
}
