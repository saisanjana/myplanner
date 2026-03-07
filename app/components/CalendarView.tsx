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
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Todo, Habit } from "@/types";
import DayModal from "./DayModal";

interface Props {
  month: Date;
  onMonthChange: (d: Date) => void;
  monthTodos: Todo[];
  habits: Habit[];
  onToggleTodo: (id: string, date: string) => void;
  onAddTodo: (text: string, date: string) => void;
  onDeleteTodo: (id: string) => void;
}

export default function CalendarView({
  month,
  onMonthChange,
  monthTodos,
  habits,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
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
      <div className="grid grid-cols-7 mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-center text-xs text-stone-600 py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayTodos = todosPerDay[dateStr] || [];
          const doneTodos = dayTodos.filter((t) => t.done);
          const undoneTodos = dayTodos.filter((t) => !t.done);
          const inMonth = isSameMonth(day, month);
          const today = isToday(day);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`relative flex flex-col items-center p-1 rounded-xl transition-all
                ${!inMonth ? "opacity-25" : ""}
                ${today ? "ring-2 ring-amber-400/60 bg-amber-400/10" : "hover:bg-stone-800"}
              `}
            >
              <span
                className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                  ${today ? "text-amber-400" : "text-stone-400"}
                `}
              >
                {format(day, "d")}
              </span>

              {/* Dots for todos */}
              {dayTodos.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-[28px]">
                  {undoneTodos.length > 0 && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-sky-400/70"
                      title={`${undoneTodos.length} todo`}
                    />
                  )}
                  {doneTodos.length > 0 && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-sky-400/30"
                      title={`${doneTodos.length} done`}
                    />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400/70" />
          <span className="text-xs text-stone-600">pending tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400/30" />
          <span className="text-xs text-stone-600">done tasks</span>
        </div>
      </div>

      {/* Day detail modal */}
      {selectedDate && (
        <DayModal
          date={selectedDate}
          todos={selectedTodos}
          habits={habits}
          onClose={() => setSelectedDate(null)}
          onToggleTodo={onToggleTodo}
          onAddTodo={onAddTodo}
          onDeleteTodo={onDeleteTodo}
        />
      )}
    </div>
  );
}
