"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import type { Habit, HabitDone, Todo, CustomList, ListItem } from "@/types";
import * as db from "@/lib/db";

const today = () => format(new Date(), "yyyy-MM-dd");

export function usePlanner() {
  const [todayDate, setTodayDate] = useState(today());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitDoneMap, setHabitDoneMap] = useState<Record<string, boolean>>({});
  const [todos, setTodos] = useState<Todo[]>([]);
  const [lists, setLists] = useState<CustomList[]>([]);
  const [listItems, setListItems] = useState<Record<string, ListItem[]>>({});
  const [loading, setLoading] = useState(true);

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [monthTodos, setMonthTodos] = useState<Todo[]>([]);

  // Refresh today's date at midnight
  useEffect(() => {
    const check = setInterval(() => {
      const t = today();
      if (t !== todayDate) setTodayDate(t);
    }, 60_000);
    return () => clearInterval(check);
  }, [todayDate]);

  // Initial load
  useEffect(() => {
    async function load() {
      setLoading(true);
      const t = today();
      // Carry forward undone todos first
      await db.carryForwardTodos(t);
      const [h, hd, td, ls] = await Promise.all([
        db.getHabits(),
        db.getHabitDoneMap(t),
        db.getTodosForDate(t),
        db.getLists(),
      ]);
      setHabits(h);
      setHabitDoneMap(hd);
      setTodos(td);
      setLists(ls);
      // Load items for all lists
      const items: Record<string, ListItem[]> = {};
      await Promise.all(
        ls.map(async (l) => {
          items[l.id] = await db.getListItems(l.id);
        })
      );
      setListItems(items);
      setLoading(false);
    }
    load();
  }, [todayDate]);

  // Load month todos when calendar month changes
  useEffect(() => {
    async function loadMonth() {
      const todos = await db.getTodosForMonth(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth()
      );
      setMonthTodos(todos);
    }
    loadMonth();
  }, [calendarMonth]);

  // ─── HABITS ────────────────────────────────────────────────────────────────

  const addHabit = useCallback(async (text: string) => {
    const id = await db.addHabit(text, habits.length);
    setHabits((prev) => [...prev, { id, text, order: prev.length, createdAt: new Date().toISOString() }]);
  }, [habits]);

  const toggleHabit = useCallback(async (habitId: string) => {
    const current = habitDoneMap[habitId] || false;
    const next = !current;
    setHabitDoneMap((prev) => ({ ...prev, [habitId]: next }));
    await db.setHabitDone(habitId, todayDate, next);
  }, [habitDoneMap, todayDate]);

  const deleteHabit = useCallback(async (id: string) => {
    await db.deleteHabit(id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const editHabit = useCallback(async (id: string, text: string) => {
    await db.updateHabit(id, text);
    setHabits((prev) => prev.map((h) => h.id === id ? { ...h, text } : h));
  }, []);

  // ─── TODOS ─────────────────────────────────────────────────────────────────

  const addTodo = useCallback(async (text: string, date?: string) => {
    const d = date || todayDate;
    const sameDayTodos = date ? monthTodos.filter(t => t.date === date) : todos;
    const id = await db.addTodo(text, d, sameDayTodos.length);
    const newTodo: Todo = {
      id, text, date: d, done: false, doneAt: null,
      carriedFrom: null, createdAt: new Date().toISOString(),
      order: sameDayTodos.length,
    };
    if (d === todayDate) {
      setTodos((prev) => [...prev, newTodo]);
    }
    setMonthTodos((prev) => [...prev, newTodo]);
  }, [todayDate, todos, monthTodos]);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const next = !todo.done;
    await db.updateTodoDone(id, next);
    setTodos((prev) =>
      prev.map((t) => t.id === id ? { ...t, done: next, doneAt: next ? new Date().toISOString() : null } : t)
    );
    setMonthTodos((prev) =>
      prev.map((t) => t.id === id ? { ...t, done: next } : t)
    );
  }, [todos]);

  const toggleTodoForDate = useCallback(async (id: string, date: string) => {
    const todo = monthTodos.find((t) => t.id === id);
    if (!todo) return;
    const next = !todo.done;
    await db.updateTodoDone(id, next);
    setMonthTodos((prev) =>
      prev.map((t) => t.id === id ? { ...t, done: next } : t)
    );
    if (date === todayDate) {
      setTodos((prev) =>
        prev.map((t) => t.id === id ? { ...t, done: next } : t)
      );
    }
  }, [monthTodos, todayDate]);

  const deleteTodo = useCallback(async (id: string) => {
    await db.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setMonthTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTodo = useCallback(async (id: string, text: string) => {
    await db.updateTodoText(id, text);
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, text } : t));
    setMonthTodos((prev) => prev.map((t) => t.id === id ? { ...t, text } : t));
  }, []);

  // ─── LISTS ─────────────────────────────────────────────────────────────────

  const addList = useCallback(async (title: string, icon: string, color: string) => {
    const id = await db.addList(title, icon, color, lists.length);
    const newList: CustomList = {
      id, title, icon, color, order: lists.length,
      createdAt: new Date().toISOString(),
    };
    setLists((prev) => [...prev, newList]);
    setListItems((prev) => ({ ...prev, [id]: [] }));
  }, [lists]);

  const deleteList = useCallback(async (id: string) => {
    await db.deleteList(id);
    setLists((prev) => prev.filter((l) => l.id !== id));
    setListItems((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }, []);

  const addListItem = useCallback(async (listId: string, text: string) => {
    const current = listItems[listId] || [];
    const id = await db.addListItem(listId, text, current.length);
    const item: ListItem = {
      id, listId, text, done: false, doneAt: null,
      createdAt: new Date().toISOString(), order: current.length,
    };
    setListItems((prev) => ({ ...prev, [listId]: [...(prev[listId] || []), item] }));
  }, [listItems]);

  const toggleListItem = useCallback(async (listId: string, itemId: string) => {
    const item = (listItems[listId] || []).find((i) => i.id === itemId);
    if (!item) return;
    const next = !item.done;
    await db.updateListItemDone(itemId, next);
    setListItems((prev) => ({
      ...prev,
      [listId]: prev[listId].map((i) =>
        i.id === itemId ? { ...i, done: next, doneAt: next ? new Date().toISOString() : null } : i
      ),
    }));
  }, [listItems]);

  const deleteListItem = useCallback(async (listId: string, itemId: string) => {
    await db.deleteListItem(itemId);
    setListItems((prev) => ({
      ...prev,
      [listId]: prev[listId].filter((i) => i.id !== itemId),
    }));
  }, []);

  const editListItem = useCallback(async (listId: string, itemId: string, text: string) => {
    await db.updateListItemText(itemId, text);
    setListItems((prev) => ({
      ...prev,
      [listId]: prev[listId].map((i) => i.id === itemId ? { ...i, text } : i),
    }));
  }, []);

  // sorted todos: undone first, done last
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.done === b.done) return a.order - b.order;
    return a.done ? 1 : -1;
  });

  return {
    todayDate,
    loading,
    habits,
    habitDoneMap,
    todos: sortedTodos,
    rawTodos: todos,
    lists,
    listItems,
    calendarMonth,
    setCalendarMonth,
    monthTodos,
    // actions
    addHabit,
    toggleHabit,
    deleteHabit,
    editHabit,
    addTodo,
    toggleTodo,
    toggleTodoForDate,
    deleteTodo,
    editTodo,
    addList,
    deleteList,
    addListItem,
    toggleListItem,
    deleteListItem,
    editListItem,
  };
}
