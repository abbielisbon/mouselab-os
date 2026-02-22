"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Welcome() {
  const router = useRouter()
  const [labId, setLabId] = useState("")
  const [booting, setBooting] = useState(false)

  function handleEnter() {
    if (!labId.trim()) return
    localStorage.setItem("mouselab-name", labId.trim())
    setBooting(true)
    setTimeout(() => {
      router.push("/desktop")
    }, 800)
  }

  return (
    <main
      className="relative overflow-hidden"
      style={{ background: "#1a1a1a", height: "100dvh", width: "100vw" }}
    >
      {/* Computer photo — fills full viewport height, centered horizontally */}
      <img
        src="/computer.png"
        alt=""
        className="absolute"
        style={{
          imageRendering: "auto",
          height: "100dvh",
          width: "auto",
          left: "50%",
          top: 0,
          transform: "translateX(-50%)",
        }}
      />

      {/*
        Terminal overlay — locked to the CRT screen.
        All positions are relative to the image which is
        100dvh tall and (100dvh * 1024/1536) wide, centered.
        Screen coordinates from 1024x1536 source:
          left edge  ≈ 20%  of image width
          top edge   ≈ 28%  of image height
          width      ≈ 60%  of image width
          height     ≈ 27%  of image height
      */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          /* Center horizontally same as image */
          left: "50%",
          transform: "translateX(-50%)",
          /* Vertical position relative to viewport = image height */
          top: "32dvh",
          /* Width relative to image width = 100dvh * (1024/1536) */
          width: "calc(100dvh * (1024 / 1536) * 0.52)",
          height: "22dvh",
          overflow: "hidden",
          borderRadius: "4px",
        }}
      >
          {/* Scanlines */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
              zIndex: 3,
            }}
          />

          {/* Terminal content */}
          <div className="relative z-10 w-full px-4" style={{ maxWidth: 220 }}>
            <p
              className="text-center text-[7px] mb-0.5"
              style={{ color: "#0a5c2a", textShadow: "none" }}
            >
              WELCOME TO
            </p>
            <p
              className="text-center text-[10px] mb-2"
              style={{ color: "#0a5c2a", textShadow: "none" }}
            >
              MOUSE LAB
            </p>

            {/* ID field */}
            <div className="mb-1">
              <label
                className="block text-[5px] mb-0.5"
                style={{ color: "#0a5c2a", opacity: 0.7 }}
              >
                ENTER YOUR ID:
              </label>
              <input
                type="text"
                value={labId}
                onChange={(e) => setLabId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEnter()}
                className="w-full px-1 py-0.5 text-[7px]"
                style={{
                  background: "transparent",
                  border: "1px solid #0a5c2a",
                  color: "#0a5c2a",
                  fontFamily: "inherit",
                  outline: "none",
                  caretColor: "#0a5c2a",
                }}
                autoFocus
              />
            </div>

            {/* Enter button */}
            <button
              onClick={handleEnter}
              className="w-full py-1 text-[7px] uppercase"
              style={{
                background: booting ? "#0a5c2a" : "transparent",
                border: "1px solid #0a5c2a",
                color: booting ? "#00ff44" : "#0a5c2a",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              {booting ? "LOADING..." : "ENTER LAB"}
            </button>

            {/* Animated mouse + cheese */}
            <div
              className="relative overflow-hidden mt-2"
              style={{ height: 36, width: "100%" }}
            >
              {/* Cheese wedge */}
              <div className="absolute cheese-chomp" style={{ right: 6, top: 18 }}>
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
                    <div key={i} style={{ width: 3, height: 3, background: p ? "#0a5c2a" : "transparent" }} />
                  ))}
                </div>
              </div>

              {/* Mouse scurrying */}
              <div
                className="absolute"
                style={{
                  top: 13,
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
                        <div key={i} style={{ width: 3, height: 3, background: p ? "#0a5c2a" : "transparent" }} />
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
                        <div key={i} style={{ width: 3, height: 3, background: p ? "#0a5c2a" : "transparent" }} />
                      ))}
                    </div>
                  </div>

                  <div className="absolute" style={{ left: 60, top: 14, width: 3, height: 3, background: "transparent" }} />
                  <div className="absolute mouse-foot-flicker" style={{ left: 34, top: 27, width: 6, height: 3, background: "#0a5c2a" }} />
                  <div className="absolute mouse-foot-flicker" style={{ left: 49, top: 27, width: 6, height: 3, background: "#0a5c2a", animationDelay: "-0.09s" }} />
                </div>
              </div>

              {/* Ground line */}
              <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: "#0a5c2a", opacity: 0.5 }} />
            </div>

            {/* Blinking cursor */}
            <p
              className="mt-1 text-[5px]"
              style={{ color: "#0a5c2a", opacity: 0.4 }}
            >
              C:\MOUSELAB&gt;{" "}
              <span style={{ animation: "blink 1s steps(1) infinite" }}>_</span>
            </p>
          </div>
        </div>
    </main>
  )
}
