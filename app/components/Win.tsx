export function Win({ title, children }: { title: string; children: React.ReactNode }) {
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
            width: 8, height: 8,
            background: "#c5d0de",
            border: "1px solid #7a8a9e",
          }} />
          <div style={{
            width: 8, height: 8,
            background: "#c5d0de",
            border: "1px solid #7a8a9e",
          }} />
        </div>
      </div>
      {/* Content */}
      <div className="p-2">{children}</div>
    </div>
  )
}
