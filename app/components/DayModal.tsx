"use client";

import { useState, useEffect } from "react";
import { X, Plus, Check, Trash2, CornerDownRight } from "lucide-react";
import { format, isToday, isPast, isFuture } from "date-fns";
import type { Habit, Todo } from "@/types";

interface Props {
  date: string; // YYYY-MM-DD
  todos: Todo[];
  habits: Habit[];
  habitDoneMap?: Record<string, boolean>;
  onClose: () => void;
  onToggleTodo: (id: string, date: string) => void;
  onAddTodo: (text: string, date: string) => void;
  onDeleteTodo: (id: string) => void;
  onToggleHabit?: (id: string, date?: string) => void;
}

export default function DayModal({
  date,
  todos,
  habits,
  habitDoneMap = {},
  onClose,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
  onToggleHabit,
}: Props) {
  const [newText, setNewText] = useState("");
  const dateObj = new Date(date + "T12:00:00");
  const isPastDay = isPast(dateObj) && !isToday(dateObj);
  const isTodayDay = isToday(dateObj);
  const isFutureDay = isFuture(dateObj) && !isToday(dateObj);

  const doneTodos = todos.filter((t) => t.done);
  const undoneTodos = todos.filter((t) => !t.done);

  const handleAdd = () => {
    const t = newText.trim();
    if (!t) return;
    onAddTodo(t, date);
    setNewText("");
  };

  const handleToggleHabit = (habitId: string) => {
    if (onToggleHabit) {
      // For today, toggle normally. For other dates, you might need date-specific logic
      onToggleHabit(habitId, date);
    }
  };

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <div>
            <h2 className="font-semibold text-stone-100 text-base">
              {format(dateObj, "EEEE, MMMM d")}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {isTodayDay && "Today"}
              {isPastDay && "Past day"}
              {isFutureDay && "Future day"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-800 text-stone-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Habits section — show for all days */}
          {habits.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">
                Daily Habits
                {isPastDay && (
                  <span className="ml-2 normal-case font-normal text-stone-600">
                    (historical data)
                  </span>
                )}
              </p>
              <ul className="space-y-1.5">
                {habits.map((h) => {
                  // For today, use habitDoneMap; for other dates, we'd need date-specific data
                  // Since we don't have that structure, we'll show habits as checkable only for today
                  const done = isTodayDay ? (habitDoneMap[h.id] || false) : false;
                  const canToggle = isTodayDay && onToggleHabit;

                  return (
                    <li
                      key={h.id}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl
                        ${done ? "bg-amber-400/10 opacity-70" : "bg-stone-800/50"}`}
                    >
                      <button
                        onClick={() => canToggle && handleToggleHabit(h.id)}
                        disabled={!canToggle}
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all
                          ${done ? "bg-amber-400 border-amber-400" : "border-stone-600"}
                          ${canToggle ? "cursor-pointer hover:border-amber-400" : "cursor-default opacity-50"}`}
                      >
                        {done && <Check size={10} strokeWidth={3} className="text-stone-900" />}
                      </button>
                      <span className={`text-sm flex-1 ${done ? "line-through text-stone-500" : "text-stone-300"}`}>
                        {h.text}
                      </span>
                      {!isTodayDay && (
                        <span className="text-xs text-stone-600 italic">
                          {isPastDay ? "no data" : "future"}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {!isTodayDay && (
                <p className="text-[10px] text-stone-600 mt-2 italic">
                  Note: Habit tracking is currently only available for today. Historical tracking coming soon!
                </p>
              )}
            </div>
          )}

          {/* Todos section */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">
              Tasks
              {isPastDay && todos.length > 0 && (
                <span className="ml-2 normal-case font-normal text-stone-600">
                  {doneTodos.length}/{todos.length} done
                </span>
              )}
            </p>

            {todos.length === 0 ? (
              <p className="text-stone-600 text-sm text-center py-3">No tasks for this day</p>
            ) : (
              <ul className="space-y-1.5">
                {[...undoneTodos, ...doneTodos].map((todo) => (
                  <li
                    key={todo.id}
                    className={`flex items-start gap-2.5 px-3 py-2 rounded-xl group
                      ${todo.done ? "opacity-45 bg-stone-800/30" : "bg-stone-800/50"}`}
                  >
                    <button
                      onClick={() => onToggleTodo(todo.id, date)}
                      disabled={isPastDay}
                      className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all
                        ${todo.done ? "bg-sky-500 border-sky-500" : "border-stone-600 hover:border-sky-400"}
                        ${isPastDay ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {todo.done && <Check size={10} strokeWidth={3} className="text-white" />}
                    </button>
                    <div className="flex-1">
                      <span className={`text-sm ${todo.done ? "line-through text-stone-500" : "text-stone-200"}`}>
                        {todo.text}
                      </span>
                      {todo.carriedFrom && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <CornerDownRight size={9} className="text-sky-500/60" />
                          <span className="text-xs text-sky-500/60">
                            carried from {format(new Date(todo.carriedFrom + "T12:00:00"), "MMM d")}
                          </span>
                        </div>
                      )}
                    </div>
                    {!isPastDay && (
                      <button
                        onClick={() => onDeleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-900/40 text-stone-600 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Add todo (not for past days) */}
            {!isPastDay && (
              <div className="flex gap-2 mt-3">
                <input
                  className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm
                    text-stone-200 placeholder-stone-500 outline-none focus:border-sky-400/60 transition-colors"
                  placeholder="Add a task..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <button
                  onClick={handleAdd}
                  className="px-3 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}