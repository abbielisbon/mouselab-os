export function Win({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "2px solid #888", background: "#fff" }}>
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
      <div className="p-2">{children}</div>
    </div>
  )
}
