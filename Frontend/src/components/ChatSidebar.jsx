// // src/components/ChatSidebar.jsx
// import React from "react";
// import ChatHistoryItem from "./ChatHistoryItem";
// import { useTheme } from "../context/ThemeContext";

// export default function ChatSidebar({
//   chats,
//   activeChatId,
//   onNewChat,
//   onSelectChat,
//   onRenameChat,
//   onDeleteChat
// }) {
//   const { theme } = useTheme();

//   return (
//     <aside
//       className={`w-[260px] flex flex-col border-r 
//       ${
//         theme === "dark"
//           ? "bg-[#0b1a17] border-green-900 text-green-100"
//           : "bg-[#f5f5f5] border-gray-300 text-gray-900"
//       }`}
//     >
//       {/* Header */}
//       <div
//         className={`p-4 border-b 
//         ${theme === "dark" ? "border-green-900" : "border-gray-300"}`}
//       >
//         <button
//           onClick={onNewChat}
//           className={`w-full py-2 rounded-lg font-semibold 
//           ${
//             theme === "dark"
//               ? "bg-green-600 hover:bg-green-500 text-white"
//               : "bg-green-600 hover:bg-green-500 text-white"
//           }`}
//         >
//           ➕ New Chat
//         </button>
//       </div>

//       {/* Chat list */}
//       <div className="flex-1 overflow-y-auto p-2 space-y-2">
//         {chats.length === 0 ? (
//           <p
//             className={`text-center text-sm mt-4 ${
//               theme === "dark" ? "text-green-300" : "text-gray-600"
//             }`}
//           >
//             No chats yet.
//           </p>
//         ) : (
//           chats.map((chat) => (
//             <ChatHistoryItem
//               key={chat.id}
//               chat={chat}
//               active={chat.id === activeChatId}
//               onSelect={() => onSelectChat(chat)}
//               onRename={(newName) => onRenameChat(chat.id, newName)}
//               onDelete={() => onDeleteChat(chat.id)}
//             />
//           ))
//         )}
//       </div>

//       <div
//         className={`p-3 border-t text-center text-xs 
//         ${theme === "dark" ? "border-green-900 text-green-300 bg-[#051211]" : "border-gray-300 text-gray-700 bg-gray-200"}`}
//       >
//         EcoChat 🌿
//       </div>
//     </aside>
//   );
// }
import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onSearch
}) {
  const [editing, setEditing] = useState(null);

  return (
    <div className="w-64 border-r p-4 overflow-y-auto">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search chats..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg border dark:bg-[#0b1a17] dark:text-white"
      />

      {/* NEW CHAT */}
      <button
        onClick={onNewChat}
        className="w-full bg-green-600 text-white py-2 rounded-lg mb-4"
      >
        + New Chat
      </button>

      {/* CHAT LIST */}
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`p-3 rounded-lg cursor-pointer mb-2 ${
            activeChatId === chat.id
              ? "bg-green-100 dark:bg-green-800"
              : "hover:bg-green-50 dark:hover:bg-[#123]"
          }`}
        >
          <div className="flex justify-between items-center">
            {/* TITLE OR INPUT */}
            {editing === chat.id ? (
              <input
                className="bg-transparent border-b border-gray-500 w-full"
                defaultValue={chat.title}
                onBlur={(e) => {
                  onRenameChat(chat.id, e.target.value);
                  setEditing(null);
                }}
                autoFocus
              />
            ) : (
              <p onClick={() => onSelectChat(chat)} className="font-medium">
                {chat.title}
              </p>
            )}

            <div className="flex gap-2">
              <Pencil
                size={16}
                className="cursor-pointer text-blue-500"
                onClick={() => setEditing(chat.id)}
              />
              <Trash2
                size={16}
                className="cursor-pointer text-red-500"
                onClick={() => onDeleteChat(chat.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
