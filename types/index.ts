export interface Habit {
  id: string;
  text: string;
  order: number;
  createdAt: string;
}

export interface HabitDone {
  // doc id = habitId_YYYY-MM-DD
  habitId: string;
  date: string; // YYYY-MM-DD
  done: boolean;
}

export interface Todo {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD — the day it belongs to
  done: boolean;
  doneAt?: string | null;
  carriedFrom?: string | null; // original date if carried forward
  createdAt: string;
  order: number;
}

export interface CustomList {
  id: string;
  title: string;
  icon: string; // emoji
  color: string; // tailwind color class or hex
  order: number;
  createdAt: string;
}

export interface ListItem {
  id: string;
  listId: string;
  text: string;
  done: boolean;
  doneAt?: string | null;
  createdAt: string;
  order: number;
}
