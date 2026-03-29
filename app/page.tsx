"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Loader2, LayoutDashboard, Calendar } from "lucide-react";
import { usePlanner } from "@/hooks/usePlanner";
import HabitsList from "./components/HabitsList";
import TodayTodos from "./components/TodayTodos";
import CollapsibleList from "./components/CollapsibleList";
import CalendarView from "./components/CalendarView";
import SectionCard from "./components/SectionCard";
import AddListModal from "./components/AddListModal";

type Tab = "dashboard" | "calendar";

export default function Dashboard() {
  const planner = usePlanner();
  const [showAddList, setShowAddList] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  if (planner.loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
          <p className="text-stone-500 text-sm">Loading your planner...</p>
        </div>
      </div>
    );
  }

  const dateObj = new Date(planner.todayDate + "T12:00:00");
  const undoneCount = planner.todos.filter((t) => !t.done).length;
  const habitsDoneCount = Object.values(planner.habitDoneMap).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/60">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-bold text-lg text-amber-400 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                My Planner
              </h1>
              <p className="text-xs text-stone-500">
                {format(dateObj, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Summary chips */}
              <div className="hidden sm:flex gap-1.5">
                {undoneCount > 0 && (
                  <span className="text-xs bg-sky-500/15 text-sky-400 px-2.5 py-1 rounded-full">
                    {undoneCount} task{undoneCount !== 1 ? "s" : ""} left
                  </span>
                )}
                {planner.habits.length > 0 && (
                  <span className="text-xs bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full">
                    {habitsDoneCount}/{planner.habits.length} habits
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${activeTab === "dashboard"
                  ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                  : "text-stone-500 hover:text-stone-300 hover:bg-stone-800/50"
                }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${activeTab === "calendar"
                  ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                  : "text-stone-500 hover:text-stone-300 hover:bg-stone-800/50"
                }`}
            >
              <Calendar size={16} />
              Calendar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5">
        {/* Mobile summary */}
        <div className="flex sm:hidden gap-2 mb-4">
          {undoneCount > 0 && (
            <span className="text-xs bg-sky-500/15 text-sky-400 px-2.5 py-1 rounded-full">
              {undoneCount} tasks left
            </span>
          )}
          {planner.habits.length > 0 && (
            <span className="text-xs bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full">
              {habitsDoneCount}/{planner.habits.length} habits done
            </span>
          )}
        </div>

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* ── Row 1: Today's Tasks + Daily Habits ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Today's todos - LEFT */}
              <SectionCard
                title="Today's Tasks"
                icon="✅"
                accentColor="#3b82f6"
                badge={`${planner.todos.filter(t => t.done).length}/${planner.todos.length}`}
                collapsible={true}
                defaultCollapsed={false}
              >
                <TodayTodos
                  todos={planner.todos}
                  onToggle={planner.toggleTodo}
                  onAdd={planner.addTodo}
                  onDelete={planner.deleteTodo}
                  onEdit={planner.editTodo}
                />
              </SectionCard>

              {/* Habits - RIGHT */}
              <SectionCard
                title="Daily Habits"
                icon="🔁"
                accentColor="#f59e0b"
                badge={`${habitsDoneCount}/${planner.habits.length}`}
                collapsible={true}
                defaultCollapsed={false}
              >
                <HabitsList
                  habits={planner.habits}
                  doneMap={planner.habitDoneMap}
                  onToggle={planner.toggleHabit}
                  onAdd={planner.addHabit}
                  onDelete={planner.deleteHabit}
                  onEdit={planner.editHabit}
                />
              </SectionCard>
            </div>

            {/* ── Row 2: Custom Lists ── */}
            <div>
              {/* Custom lists header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-widest">
                  My Lists
                </h2>
                <button
                  onClick={() => setShowAddList(true)}
                  className="flex items-center gap-1.5 text-xs bg-stone-800 hover:bg-stone-700
                    text-stone-300 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <Plus size={13} />
                  New List
                </button>
              </div>

              {planner.lists.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 border-dashed rounded-2xl p-8 text-center">
                  <p className="text-stone-600 text-sm mb-1">No lists yet</p>
                  <p className="text-stone-700 text-xs">Create lists for shopping, ideas, goals, etc.</p>
                  <button
                    onClick={() => setShowAddList(true)}
                    className="mt-3 text-xs bg-stone-800 hover:bg-stone-700 text-stone-400 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    + Create first list
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {planner.lists.map((list) => (
                    <CollapsibleList
                      key={list.id}
                      list={list}
                      items={planner.listItems[list.id] || []}
                      onAddItem={planner.addListItem}
                      onToggleItem={planner.toggleListItem}
                      onDeleteItem={planner.deleteListItem}
                      onEditItem={planner.editListItem}
                      onDeleteList={planner.deleteList}
                      defaultCollapsed={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {activeTab === "calendar" && (
          <div className="max-w-4xl mx-auto">
            <SectionCard
              title="Calendar"
              icon="📅"
              accentColor="#10b981"
            >
              <CalendarView
                month={planner.calendarMonth}
                onMonthChange={planner.setCalendarMonth}
                monthTodos={planner.monthTodos}
                habits={planner.habits}
                habitDoneMap={planner.habitDoneMap}
                onToggleTodo={planner.toggleTodoForDate}
                onAddTodo={planner.addTodo}
                onDeleteTodo={planner.deleteTodo}
                onToggleHabit={planner.toggleHabit}
              />
            </SectionCard>
          </div>
        )}
      </main>

      {/* Add list modal */}
      {showAddList && (
        <AddListModal
          onAdd={planner.addList}
          onClose={() => setShowAddList(false)}
        />
      )}
    </div>
  );
}