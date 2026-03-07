"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  icon: React.ReactNode;
  accentColor?: string;
  badge?: string;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function SectionCard({
  title,
  icon,
  accentColor = "#f59e0b",
  badge,
  defaultCollapsed = false,
  collapsible = false,
  children,
  action,
}: Props) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 border-b border-stone-800
          ${collapsible ? "cursor-pointer hover:bg-stone-800/50 select-none" : ""}`}
        style={{ borderTop: `3px solid ${accentColor}` }}
        onClick={() => collapsible && setCollapsed(!collapsed)}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          {icon}
        </div>
        <span className="font-semibold text-sm text-stone-200 flex-1">{title}</span>
        {badge && (
          <span className="text-xs text-stone-500 bg-stone-800 px-2 py-0.5 rounded-full">{badge}</span>
        )}
        {action && !collapsible && (
          <div onClick={(e) => e.stopPropagation()}>{action}</div>
        )}
        {collapsible && (
          <ChevronDown
            size={16}
            className={`text-stone-500 transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`}
          />
        )}
      </div>

      {!collapsed && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}
