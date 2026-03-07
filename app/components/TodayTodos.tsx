"use client";

import { useState } from "react";
import { Check, Plus, Trash2, Pencil, CornerDownRight } from "lucide-react";
import type { Todo } from "@/types";
import { format } from "date-fns";

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export default function TodayTodos({ todos, onToggle, onAdd, onDelete, onEdit }: Props) {
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const doneCount = todos.filter((t) => t.done).length;

  const handleAdd = () => {
    const t = newText.trim();
    if (!t) return;
    onAdd(t);
    setNewText("");
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) onEdit(id, editText.trim());
    setEditingId(null);
  };

  return (
    <div>
      {todos.length > 0 && (
        <p className="text-xs text-stone-500 mb-3">
          {doneCount}/{todos.length} done
          {todos.length - doneCount > 0 && (
            <span className="ml-2 text-sky-400/70">
              · {todos.length - doneCount} will carry forward if undone
            </span>
          )}
        </p>
      )}

      <ul className="space-y-1.5">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-all group
              ${todo.done ? "opacity-45" : ""}
              bg-stone-800/50 hover:bg-stone-800`}
          >
            <button
              onClick={() => onToggle(todo.id)}
              className={`w-5 h-5 mt-0.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all
                ${todo.done
                  ? "bg-sky-500 border-sky-500"
                  : "border-stone-600 hover:border-sky-400"
                }`}
            >
              {todo.done && <Check size={11} strokeWidth={3} className="text-white" />}
            </button>

            <div className="flex-1 min-w-0">
              {editingId === todo.id ? (
                <input
                  className="w-full bg-transparent text-sm outline-none border-b border-sky-400 text-stone-100"
                  value={editText}
                  autoFocus
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(todo.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={() => saveEdit(todo.id)}
                />
              ) : (
                <span className={`text-sm ${todo.done ? "line-through text-stone-500" : "text-stone-200"}`}>
                  {todo.text}
                </span>
              )}

              {todo.carriedFrom && (
                <div className="flex items-center gap-1 mt-0.5">
                  <CornerDownRight size={10} className="text-sky-500/70" />
                  <span className="text-xs text-sky-500/70">
                    from {format(new Date(todo.carriedFrom + "T12:00:00"), "MMM d")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => startEdit(todo)}
                className="p-1 rounded-lg hover:bg-stone-700 text-stone-500 hover:text-stone-300"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-1 rounded-lg hover:bg-red-900/40 text-stone-500 hover:text-red-400"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </li>
        ))}

        {todos.length === 0 && (
          <p className="text-stone-500 text-sm text-center py-4">
            No tasks for today — add something below
          </p>
        )}
      </ul>

      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm
            text-stone-200 placeholder-stone-500 outline-none focus:border-sky-400/60 transition-colors"
          placeholder="Add a task for today..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl
            font-semibold text-sm transition-colors flex items-center gap-1"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
