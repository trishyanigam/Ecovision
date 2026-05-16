// src/pages/ChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import { auth } from "../firebase";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const { theme } = useTheme();

  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("eco_chat_history") || "[]"); }
    catch { return []; }
  })();

  const defaultChat = {
    id: Date.now().toString(),
    title: "New Chat",
    createdAt: new Date().toISOString(),
    messages: [{ sender: "ai", text: "Hello 🌿 Ask anything..." }],
    backendId: null
  };

  const [chats, setChats] = useState(stored.length ? stored : [defaultChat]);
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [messages, setMessages] = useState(activeChat.messages);
  const [typing, setTyping] = useState(false);
  const [search, setSearch] = useState("");
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const [autoScrollAllowed, setAutoScrollAllowed] = useState(true);

  useEffect(() => {
    localStorage.setItem("eco_chat_history", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    setMessages(activeChat?.messages || []);
  }, [activeChat]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const onScroll = () =>
      setAutoScrollAllowed(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (autoScrollAllowed && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing, autoScrollAllowed]);

  const persistActive = (updatedActive) => {
    setChats(prev =>
      prev.map(c => c.id === updatedActive.id ? updatedActive : c)
    );
    setActiveChat(updatedActive);
    setMessages(updatedActive.messages);
  };

  const ensureActiveInserted = () => {
    setChats(prev => {
      if (prev.some((c) => c.id === activeChat.id)) return prev;
      return [activeChat, ...prev];
    });
  };

  const generateAutoTitle = (text) => {
    return text
      .replace(/\s+/g, " ")              // remove extra spaces
      .replace(/[^a-zA-Z0-9 ]/g, "")     // remove special chars
      .trim()
      .slice(0, 40);                     // limit
  };

  const send = async (text) => {
    if (!text?.trim()) return;
    const currentUser = auth.currentUser;
    if (!currentUser) return alert("Please login first");

    ensureActiveInserted();

    // Insert immediate user message UI
    const next = [...(activeChat.messages || []), { sender: "user", text }];

    let updatedActive = { ...activeChat, messages: next };

    // 🔥 NEW — ChatGPT-style auto-title on FIRST user message
    if (activeChat.title === "New Chat" && next.length === 1) {
      const cleanedTitle = generateAutoTitle(text);
      const finalTitle = cleanedTitle || "New Chat";
      updatedActive = { ...updatedActive, title: finalTitle };
      // ensure rename updates sidebar too
      setChats(prev =>
        prev.map((c) => c.id === activeChat.id ? { ...c, title: finalTitle } : c)
      );
    }

    persistActive(updatedActive);
    setTyping(true);

    try {
      const { data } = await api.post("/chat/send", {
        message: text,
        chatId: activeChat.backendId || null,
      });

      let withBackendId = updatedActive;
      if (data?.chatId) {
        withBackendId = { ...updatedActive, backendId: data.chatId };
      }

      const finalMessages = [...next, { sender: "ai", text: data.reply }];
      const finalActive = { ...withBackendId, messages: finalMessages };

      persistActive(finalActive);

    } catch (err) {
      const final = [...next, { sender: "ai", text: "⚠️ Model unavailable." }];
      const finalActive = { ...updatedActive, messages: final };
      persistActive(finalActive);
    }

    setTyping(false);
  };

  const newChat = () => {
    const n = {
      id: Date.now().toString(),
      title: "New Chat",
      createdAt: new Date().toISOString(),
      messages: [{ sender: "ai", text: "Hello 🌿 Ask anything..." }],
      backendId: null
    };

    setChats(prev => [n, ...prev]);
    setActiveChat(n);
    setMessages(n.messages);
    setTyping(false);
  };

  const deleteChat = (id) => {
    setChats(prev => {
      const remain = prev.filter((c) => c.id !== id);
      if (remain.length === 0) {
        const n = {
          id: Date.now().toString(),
          title: "New Chat",
          createdAt: new Date().toISOString(),
          messages: [{ sender: "ai", text: "Hello 🌿 Ask anything..." }],
          backendId: null
        };
        setActiveChat(n);
        setMessages(n.messages);
        return [n];
      }
      if (activeChat.id === id) {
        const nextActive = remain[0];
        setActiveChat(nextActive);
        setMessages(nextActive.messages);
      }
      return remain;
    });
  };

  const renameChat = (id, title) => {
    setChats(prev => {
      const next = prev.map((c) => (c.id === id ? { ...c, title } : c));
      if (activeChat.id === id) setActiveChat({ ...activeChat, title });
      return next;
    });
  };

  return (
    <div className={`flex h-screen ${theme === "dark" ? "bg-[#07121a] text-white" : "bg-white text-black"}`}>

      <ChatSidebar
        chats={chats.filter(c =>
          c.title.toLowerCase().includes(search.toLowerCase())
        )}
        activeChatId={activeChat?.id}
        onNewChat={newChat}
        onSelectChat={(c) => setActiveChat(c)}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
        onSearch={setSearch}
      />

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className={`p-4 border-b flex justify-between items-center 
          ${theme === "dark" ? "border-green-900" : "border-gray-300"}`}>

          <h2 className="text-xl font-semibold">{activeChat.title}</h2>

          <button
            onClick={newChat}
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
          >
            + New Chat
          </button>
        </div>

        {/* MESSAGES */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-3 rounded-xl max-w-[70%] ${
                  m.sender === "user"
                    ? "bg-green-600 text-white"
                    : theme === "dark"
                    ? "bg-[#0b1a17] border border-green-800 text-green-200"
                    : "bg-gray-100 border border-gray-300 text-black"
                }`}
              >
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* TYPING INDICATOR */}
          {typing && (
            <div className="flex justify-start">
              <div
                className={`px-4 py-3 rounded-xl max-w-[70%] animate-pulse 
                  ${theme === "dark"
                    ? "bg-[#0b1a17] border border-green-800 text-green-300"
                    : "bg-gray-100 border border-gray-300 text-gray-700"
                  }`}
              >
                EcoChat is typing…
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className={`p-4 border-t ${theme === "dark" ? "border-green-900 bg-[#041312]" : "border-gray-200 bg-gray-50"}`}>
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <input
              ref={inputRef}
              className={`flex-1 px-4 py-3 rounded-xl outline-none 
                ${theme === "dark"
                  ? "bg-[#0b1a17] text-green-200 border border-green-800"
                  : "bg-white text-black border border-gray-400"}`}
              placeholder="Type your message and press Enter..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = e.target.value;
                  e.target.value = "";
                  send(val);
                }
              }}
            />

            <button
              onClick={() => {
                const val = inputRef.current.value;
                inputRef.current.value = "";
                send(val);
              }}
              className="px-6 py-3 rounded-xl bg-green-600 text-white"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}