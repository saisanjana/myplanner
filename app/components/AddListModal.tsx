"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onAdd: (title: string, icon: string, color: string) => void;
  onClose: () => void;
}

const ICONS = ["📋", "🛒", "💡", "🍳", "📚", "💪", "🎯", "✈️", "🎁", "🔧", "💼", "🌱", "🎨", "🏠", "💊"];
const COLORS = [
  "#f59e0b", "#3b82f6", "#10b981", "#ef4444",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
  "#f97316", "#6366f1",
];

export default function AddListModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("📋");
  const [color, setColor] = useState("#3b82f6");

  const handleAdd = () => {
    const t = title.trim();
    if (!t) return;
    onAdd(t, icon, color);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <h2 className="font-semibold text-stone-100">New List</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-widest mb-1.5 block">List name</label>
            <input
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-sm
                text-stone-200 placeholder-stone-500 outline-none focus:border-sky-400/60 transition-colors"
              placeholder="e.g. Cooking Ideas, Work Notes..."
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>

          {/* Icon */}
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-widest mb-1.5 block">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all
                    ${icon === ic ? "bg-stone-700 ring-2 ring-sky-400" : "bg-stone-800 hover:bg-stone-700"}`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-widest mb-1.5 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-offset-stone-900 ring-white scale-110" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="rounded-xl border border-stone-800 px-4 py-2.5 flex items-center gap-2"
            style={{ borderLeft: `3px solid ${color}` }}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-semibold text-stone-200">{title || "List preview"}</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40
              text-white font-semibold text-sm transition-colors"
          >
            Create List
          </button>
        </div>
      </div>
    </div>
  );
}
