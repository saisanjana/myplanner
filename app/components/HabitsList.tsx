"use client";

import { useState } from "react";
import { Check, Plus, Trash2, Pencil } from "lucide-react";
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
        <div className="mb-4">
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

      {/* Habits Grid - Tile Layout */}
      {habits.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {habits.map((h) => {
            const done = doneMap[h.id] || false;
            return (
              <div
                key={h.id}
                className={`relative group rounded-xl border-2 transition-all
                  ${done
                    ? "bg-amber-400/10 border-amber-400/40"
                    : "bg-stone-800/50 border-stone-700 hover:border-stone-600"
                  }`}
              >
                {editingId === h.id ? (
                  <div className="p-3">
                    <input
                      className="w-full bg-transparent text-sm outline-none border-b border-amber-400 text-stone-100 pb-1"
                      value={editText}
                      autoFocus
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(h.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onBlur={() => saveEdit(h.id)}
                    />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onToggle(h.id)}
                      className="w-full p-3 text-left"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-5 h-5 mt-0.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all
                            ${done
                              ? "bg-amber-400 border-amber-400"
                              : "border-stone-600"
                            }`}
                        >
                          {done && <Check size={12} strokeWidth={3} className="text-stone-900" />}
                        </div>
                        <span className={`text-sm leading-snug min-h-[2.5rem] flex items-center
                          ${done ? "line-through text-stone-500" : "text-stone-200"}`}>
                          {h.text}
                        </span>
                      </div>
                    </button>

                    {/* Action buttons - show on hover */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(h)}
                        className="p-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-400 hover:text-stone-200"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => onDelete(h.id)}
                        className="p-1.5 rounded-lg bg-stone-900/90 hover:bg-red-900/60 text-stone-400 hover:text-red-400"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-stone-500 text-sm text-center py-6 mb-4">
          No habits yet — add your daily routines below
        </p>
      )}

      {/* Add new habit */}
      <div className="flex gap-2">
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