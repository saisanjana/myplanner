"use client";

import { useState } from "react";
import { ChevronDown, Check, Plus, Trash2, Pencil, X } from "lucide-react";
import type { CustomList, ListItem } from "@/types";

interface Props {
  list: CustomList;
  items: ListItem[];
  onAddItem: (listId: string, text: string) => void;
  onToggleItem: (listId: string, itemId: string) => void;
  onDeleteItem: (listId: string, itemId: string) => void;
  onEditItem: (listId: string, itemId: string, text: string) => void;
  onDeleteList: (listId: string) => void;
  defaultCollapsed?: boolean;
}

export default function CollapsibleList({
  list,
  items,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onEditItem,
  onDeleteList,
  defaultCollapsed = true,
}: Props) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const doneCount = items.filter((i) => i.done).length;
  const sortedItems = [...items].sort((a, b) => {
    if (a.done === b.done) return a.order - b.order;
    return a.done ? 1 : -1;
  });

  const handleAdd = () => {
    const t = newText.trim();
    if (!t) return;
    onAddItem(list.id, t);
    setNewText("");
  };

  const startEdit = (item: ListItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = (itemId: string) => {
    if (editText.trim()) onEditItem(list.id, itemId, editText.trim());
    setEditingId(null);
  };

  return (
    <div
      className="rounded-2xl border border-stone-800 overflow-hidden"
      style={{ borderLeft: `3px solid ${list.color}` }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-stone-800/50 transition-colors select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-lg">{list.icon}</span>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm text-stone-200">{list.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <span className="text-xs text-stone-500 bg-stone-800 px-2 py-0.5 rounded-full">
              {doneCount}/{items.length}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-stone-500 transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`}
          />
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="px-4 pb-4 bg-stone-900/30">
          <ul className="space-y-1.5 mt-2">
            {sortedItems.map((item) => (
              <li
                key={item.id}
                className={`flex items-center gap-2.5 p-2 rounded-xl transition-all group
                  ${item.done ? "opacity-45" : ""}
                  hover:bg-stone-800`}
              >
                <button
                  onClick={() => onToggleItem(list.id, item.id)}
                  className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all`}
                  style={{
                    backgroundColor: item.done ? list.color : "transparent",
                    borderColor: item.done ? list.color : "#4b5563",
                  }}
                >
                  {item.done && <Check size={11} strokeWidth={3} className="text-stone-900" />}
                </button>

                {editingId === item.id ? (
                  <input
                    className="flex-1 bg-transparent text-sm outline-none border-b text-stone-100"
                    style={{ borderColor: list.color }}
                    value={editText}
                    autoFocus
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(item.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onBlur={() => saveEdit(item.id)}
                  />
                ) : (
                  <span className={`flex-1 text-sm ${item.done ? "line-through text-stone-500" : "text-stone-200"}`}>
                    {item.text}
                  </span>
                )}

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1 rounded hover:bg-stone-700 text-stone-500 hover:text-stone-300"
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    onClick={() => onDeleteItem(list.id, item.id)}
                    className="p-1 rounded hover:bg-red-900/40 text-stone-500 hover:text-red-400"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </li>
            ))}

            {items.length === 0 && (
              <p className="text-stone-600 text-xs text-center py-2">Empty — add something below</p>
            )}
          </ul>

          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-1.5 text-sm
                text-stone-200 placeholder-stone-500 outline-none transition-colors"
              style={{ "--tw-ring-color": list.color } as React.CSSProperties}
              placeholder={`Add to ${list.title}...`}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 rounded-xl font-semibold text-sm transition-colors text-stone-900"
              style={{ backgroundColor: list.color }}
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-800 flex justify-end">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Delete this list?</span>
                <button
                  onClick={() => onDeleteList(list.id)}
                  className="text-xs px-2 py-1 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs px-2 py-1 bg-stone-800 text-stone-400 rounded-lg hover:bg-stone-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-stone-600 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 size={11} /> Delete list
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}