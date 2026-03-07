import { supabase } from "./supabase";
import type { Habit, HabitDone, Todo, CustomList, ListItem } from "@/types";

const toISO = () => new Date().toISOString();

// ─── HABITS ──────────────────────────────────────────────────────────────────

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .order("order", { ascending: true });
  if (error) throw error;
  return data as Habit[];
}

export async function addHabit(text: string, order: number): Promise<string> {
  const { data, error } = await supabase
    .from("habits")
    .insert({ text, order, created_at: toISO() })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateHabit(id: string, text: string) {
  const { error } = await supabase
    .from("habits")
    .update({ text })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteHabit(id: string) {
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) throw error;
}

// ─── HABIT COMPLETIONS ───────────────────────────────────────────────────────

export async function getHabitDoneMap(date: string): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from("habit_done")
    .select("habit_id, done")
    .eq("date", date);
  if (error) throw error;
  const map: Record<string, boolean> = {};
  (data || []).forEach((row: any) => {
    map[row.habit_id] = row.done;
  });
  return map;
}

export async function setHabitDone(habitId: string, date: string, done: boolean) {
  // upsert using the unique constraint on (habit_id, date)
  const { error } = await supabase
    .from("habit_done")
    .upsert({ habit_id: habitId, date, done }, { onConflict: "habit_id,date" });
  if (error) throw error;
}

// ─── TODOS ───────────────────────────────────────────────────────────────────

export async function getTodosForDate(date: string): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("date", date)
    .order("order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapTodo);
}

export async function getTodosForMonth(year: number, month: number): Promise<Todo[]> {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-31`;
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true })
    .order("order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapTodo);
}

export async function addTodo(
  text: string,
  date: string,
  order: number,
  carriedFrom?: string
): Promise<string> {
  const { data, error } = await supabase
    .from("todos")
    .insert({
      text,
      date,
      done: false,
      done_at: null,
      carried_from: carriedFrom || null,
      created_at: toISO(),
      order,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateTodoDone(id: string, done: boolean) {
  const { error } = await supabase
    .from("todos")
    .update({ done, done_at: done ? toISO() : null })
    .eq("id", id);
  if (error) throw error;
}

export async function updateTodoText(id: string, text: string) {
  const { error } = await supabase.from("todos").update({ text }).eq("id", id);
  if (error) throw error;
}

export async function deleteTodo(id: string) {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw error;
}

export async function carryForwardTodos(today: string): Promise<void> {
  // Find all undone todos with date < today and move them to today
  const { data, error } = await supabase
    .from("todos")
    .select("id, date, carried_from")
    .eq("done", false)
    .lt("date", today);
  if (error) throw error;
  if (!data || data.length === 0) return;

  const updates = data.map((row: any) =>
    supabase
      .from("todos")
      .update({
        date: today,
        carried_from: row.carried_from || row.date,
      })
      .eq("id", row.id)
  );
  await Promise.all(updates);
}

// ─── CUSTOM LISTS ────────────────────────────────────────────────────────────

export async function getLists(): Promise<CustomList[]> {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .order("order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapList);
}

export async function addList(
  title: string,
  icon: string,
  color: string,
  order: number
): Promise<string> {
  const { data, error } = await supabase
    .from("lists")
    .insert({ title, icon, color, order, created_at: toISO() })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateList(id: string, updates: Partial<CustomList>) {
  const { error } = await supabase.from("lists").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteList(id: string) {
  // Delete all items first, then the list
  await supabase.from("list_items").delete().eq("list_id", id);
  const { error } = await supabase.from("lists").delete().eq("id", id);
  if (error) throw error;
}

// ─── LIST ITEMS ──────────────────────────────────────────────────────────────

export async function getListItems(listId: string): Promise<ListItem[]> {
  const { data, error } = await supabase
    .from("list_items")
    .select("*")
    .eq("list_id", listId)
    .order("order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapListItem);
}

export async function addListItem(
  listId: string,
  text: string,
  order: number
): Promise<string> {
  const { data, error } = await supabase
    .from("list_items")
    .insert({ list_id: listId, text, done: false, done_at: null, created_at: toISO(), order })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateListItemDone(id: string, done: boolean) {
  const { error } = await supabase
    .from("list_items")
    .update({ done, done_at: done ? toISO() : null })
    .eq("id", id);
  if (error) throw error;
}

export async function updateListItemText(id: string, text: string) {
  const { error } = await supabase.from("list_items").update({ text }).eq("id", id);
  if (error) throw error;
}

export async function deleteListItem(id: string) {
  const { error } = await supabase.from("list_items").delete().eq("id", id);
  if (error) throw error;
}

// ─── ROW MAPPERS (snake_case DB → camelCase TS) ──────────────────────────────

function mapTodo(row: any): Todo {
  return {
    id: row.id,
    text: row.text,
    date: row.date,
    done: row.done,
    doneAt: row.done_at,
    carriedFrom: row.carried_from,
    createdAt: row.created_at,
    order: row.order,
  };
}

function mapList(row: any): CustomList {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    color: row.color,
    order: row.order,
    createdAt: row.created_at,
  };
}

function mapListItem(row: any): ListItem {
  return {
    id: row.id,
    listId: row.list_id,
    text: row.text,
    done: row.done,
    doneAt: row.done_at,
    createdAt: row.created_at,
    order: row.order,
  };
}
