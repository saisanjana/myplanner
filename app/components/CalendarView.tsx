"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Todo, Habit } from "@/types";
import DayModal from "./DayModal";

interface Props {
  month: Date;
  onMonthChange: (d: Date) => void;
  monthTodos: Todo[];
  habits: Habit[];
  habitDoneMap?: Record<string, boolean>;
  onToggleTodo: (id: string, date: string) => void;
  onAddTodo: (text: string, date: string) => void;
  onDeleteTodo: (id: string) => void;
  onToggleHabit?: (id: string) => void;
}

export default function CalendarView({
  month,
  onMonthChange,
  monthTodos,
  habits,
  habitDoneMap,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
  onToggleHabit,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const todosPerDay: Record<string, Todo[]> = {};
  monthTodos.forEach((todo) => {
    if (!todosPerDay[todo.date]) todosPerDay[todo.date] = [];
    todosPerDay[todo.date].push(todo);
  });

  const prevMonth = () => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const nextMonth = () => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  const selectedTodos = selectedDate ? (todosPerDay[selectedDate] || []) : [];

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-semibold text-stone-200 text-sm">
          {format(month, "MMMM yyyy")}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
          <div key={i} className="text-center text-xs text-stone-500 py-1 font-semibold">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid with borders and inline tasks */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayTodos = todosPerDay[dateStr] || [];
          const visibleTodos = dayTodos.slice(0, 3); // Show max 3 tasks
          const remainingCount = dayTodos.length - 3;
          const inMonth = isSameMonth(day, month);
          const today = isToday(day);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`relative flex flex-col p-2 rounded-lg border transition-all min-h-[100px] text-left
                ${!inMonth ? "opacity-30 bg-stone-900/30" : "bg-stone-900/50"}
                ${today ? "ring-2 ring-amber-400/60 border-amber-400/40 bg-amber-400/5" : "border-stone-800"}
                hover:border-stone-700 hover:bg-stone-800/70
              `}
            >
              {/* Date number */}
              <span
                className={`text-sm font-semibold mb-1
                  ${today ? "text-amber-400" : inMonth ? "text-stone-300" : "text-stone-600"}
                `}
              >
                {format(day, "d")}
              </span>

              {/* Tasks list */}
              {visibleTodos.length > 0 && (
                <div className="space-y-1 flex-1">
                  {visibleTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`text-[10px] leading-tight px-1.5 py-0.5 rounded truncate
                        ${todo.done
                          ? "bg-sky-500/20 text-sky-300/60 line-through"
                          : "bg-sky-500/30 text-sky-200"
                        }`}
                      title={todo.text}
                    >
                      {todo.text}
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <div className="text-[9px] text-stone-500 px-1.5">
                      +{remainingCount} more
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-sky-500/30 border border-sky-500/50" />
          <span className="text-xs text-stone-600">pending task</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-sky-500/20 border border-sky-500/30" />
          <span className="text-xs text-stone-600">done task</span>
        </div>
      </div>

      {/* Day detail modal */}
      {selectedDate && (
        <DayModal
          date={selectedDate}
          todos={selectedTodos}
          habits={habits}
          habitDoneMap={habitDoneMap}
          onClose={() => setSelectedDate(null)}
          onToggleTodo={onToggleTodo}
          onAddTodo={onAddTodo}
          onDeleteTodo={onDeleteTodo}
          onToggleHabit={onToggleHabit}
        />
      )}
    </div>
  );
}