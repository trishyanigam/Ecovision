// src/components/ChatHistoryItem.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ChatHistoryItem({
  chat,
  active,
  onSelect,
  onRename,
  onDelete
}) {
  const { theme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(chat.title || "New Chat");

  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-md cursor-pointer border-l-4 transition
      ${
        active
          ? theme === "dark"
            ? "bg-green-800/20 border-green-600"
            : "bg-green-100 border-green-500"
          : theme === "dark"
          ? "hover:bg-green-900/10 border-transparent"
          : "hover:bg-gray-200 border-transparent"
      }`}
    >
      {editing ? (
        <>
          <input
            className={`w-full rounded px-2 py-1 text-sm outline-none
            ${
              theme === "dark"
                ? "bg-[#0b2a22] border border-green-700 text-green-200"
                : "bg-white border border-gray-400 text-gray-800"
            }`}
            value={val}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setVal(e.target.value)}
          />

          <div className="flex gap-3 mt-2">
            <button
              className={`text-xs ${
                theme === "dark" ? "text-green-300" : "text-green-600"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onRename(val);
                setEditing(false);
              }}
            >
              Save
            </button>

            <button
              className="text-xs text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Title */}
          <div
            className={`font-semibold text-sm truncate flex items-center gap-2
            ${
              theme === "dark" ? "text-green-100" : "text-gray-900"
            }`}
          >
            💬 {chat.title}
          </div>

          {/* Preview */}
          <div
            className={`text-xs truncate mt-1
            ${theme === "dark" ? "text-green-300" : "text-gray-600"}`}
          >
            {chat.messages?.slice(-1)[0]?.text || "No messages yet."}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2 text-xs">
            <button
              className={theme === "dark" ? "text-green-300" : "text-green-600"}
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
            >
              ✏️
            </button>
            <button
              className="text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Delete this chat?")) onDelete();
              }}
            >
              🗑
            </button>
          </div>
        </>
      )}
    </div>
  );
}
