"use client";

import { useState } from "react";
import { Check, Plus, Trash2, Pencil, X, RotateCcw } from "lucide-react";
import type { Habit } from "@/types";

interface Props {
  habits: Habit[];
  doneMap: Record<string, boolean>;
  onToggle: (id: string) => void;
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export default function HabitsList({ habits, doneMap, onToggle, onAdd, onDelete, onEdit }: Props) {
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const doneCount = habits.filter((h) => doneMap[h.id]).length;

  const handleAdd = () => {
    const t = newText.trim();
    if (!t) return;
    onAdd(t);
    setNewText("");
  };

  const startEdit = (h: Habit) => {
    setEditingId(h.id);
    setEditText(h.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) onEdit(id, editText.trim());
    setEditingId(null);
  };

  return (
    <div>
      {/* Progress bar */}
      {habits.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-stone-400">
              {doneCount}/{habits.length} completed
            </span>
            <span className="text-xs font-semibold text-amber-400">
              {habits.length > 0 ? Math.round((doneCount / habits.length) * 100) : 0}%
            </span>
          </div>
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${habits.length > 0 ? (doneCount / habits.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <ul className="space-y-1.5">
        {habits.map((h) => {
          const done = doneMap[h.id] || false;
          return (
            <li
              key={h.id}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all group
                ${done ? "opacity-50" : ""}
                bg-stone-800/50 hover:bg-stone-800`}
            >
              <button
                onClick={() => onToggle(h.id)}
                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all
                  ${done
                    ? "bg-amber-400 border-amber-400"
                    : "border-stone-600 hover:border-amber-400"
                  }`}
              >
                {done && <Check size={11} strokeWidth={3} className="text-stone-900" />}
              </button>

              {editingId === h.id ? (
                <input
                  className="flex-1 bg-transparent text-sm outline-none border-b border-amber-400 text-stone-100"
                  value={editText}
                  autoFocus
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(h.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={() => saveEdit(h.id)}
                />
              ) : (
                <span className={`flex-1 text-sm ${done ? "line-through text-stone-500" : "text-stone-200"}`}>
                  {h.text}
                </span>
              )}

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(h)}
                  className="p-1 rounded-lg hover:bg-stone-700 text-stone-500 hover:text-stone-300"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => onDelete(h.id)}
                  className="p-1 rounded-lg hover:bg-red-900/40 text-stone-500 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </li>
          );
        })}

        {habits.length === 0 && (
          <p className="text-stone-500 text-sm text-center py-4">
            No habits yet — add your daily routines below
          </p>
        )}
      </ul>

      {/* Add new */}
      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm
            text-stone-200 placeholder-stone-500 outline-none focus:border-amber-400/60 transition-colors"
          placeholder="Add a daily habit..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded-xl
            font-semibold text-sm transition-colors flex items-center gap-1"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
