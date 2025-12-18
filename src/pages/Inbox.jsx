// ----------------------------------------------------------
// FINAL WHATSAPP STYLE INBOX — FIXED KEYS, SORTING, UNREAD
// ----------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import socket from "../services/socket";
import {
  getChatContacts,
  searchUsers,
  getGroupMessages,
  createOrGetOneToOneGroup,
} from "../services/chatService";
import { retriveDataFromJWTToken } from "../services/authService";

// ------------------ Cloudinary Upload ------------------
const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Cloudinary upload failed");

  return await res.json();
};

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function Inbox() {
  const [currentUser, setCurrentUser] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [inputMessage, setInputMessage] = useState("");
  const [typingMap, setTypingMap] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const messageEndRef = useRef(null);

  // ------------------ Load logged user ------------------
  useEffect(() => {
    setCurrentUser(retriveDataFromJWTToken());
  }, []);

  // =====================================================
  // LOAD CONTACTS (SORTED + UNREAD SUPPORT)
  // =====================================================
  useEffect(() => {
    if (!currentUser?.usersId) return;

    (async () => {
      const res = await getChatContacts(currentUser.usersId);
      const list = res.data || [];

      const normalized = list.map((u) => ({
        usersId: Number(u.otherUserId),

        // SAFE email fallback
        email: u.otherEmail || "",
        username: (u.otherEmail || "").split("@")[0] || "unknown",

        groupId: u.groupId || null,

        lastMessage:
          u.lastMessageType === "image"
            ? "📷 Photo"
            : u.lastMessage || "",

        lastMessageTime: u.lastMessageTime || "",
        unread: u.unreadCount || 0,
      }));

      // FIX: initial unread counts
      const unread = {};
      normalized.forEach((c) => {
        unread[c.usersId] = c.unread;
      });
      setUnreadMap(unread);

      // sort by latest
      normalized.sort(
        (a, b) =>
          new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
      );

      setContacts(normalized);
    })();
  }, [currentUser]);

  // =====================================================
  // SOCKET LISTENERS
  // =====================================================
  useEffect(() => {
    if (!socket || !currentUser) return;

    // ------------------ RECEIVE MESSAGE ------------------
    const onReceive = (msg) => {
      msg.senderId = Number(msg.senderId);
      msg.groupId = Number(msg.groupId);

      const isFromMe = msg.senderId === Number(currentUser.usersId);
      const otherUserId = isFromMe ? selectedChat?.usersId : msg.senderId;

      // 1️⃣ Update contacts instantly (move to top + update last msg)
      setContacts((prev) => {
        const exists = prev.some((c) => c.usersId === otherUserId);

        const updated = prev.map((c) =>
          c.usersId === otherUserId
            ? {
              ...c,
              lastMessage:
                msg.messageType === "image"
                  ? "📷 Photo"
                  : msg.message || (msg.fileUrl ? "📎 File" : ""),
              lastMessageTime: msg.createdAt,
            }
            : c
        );

        // If does not exist → add new contact entry
        if (!exists && !isFromMe) {
          updated.push({
            usersId: otherUserId,
            email: msg.senderEmail,
            username: msg.senderEmail.split("@")[0],
            groupId: msg.groupId,
            lastMessage:
              msg.messageType === "image"
                ? "📷 Photo"
                : msg.message || (msg.fileUrl ? "📎 File" : ""),
            lastMessageTime: msg.createdAt,
            unread: 0,
          });
        }

        // Sort by latest msg
        updated.sort(
          (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );
        return [...updated];
      });

      // 2️⃣ UNREAD COUNT (REAL TIME)
      const chatCurrentlyOpen =
        selectedChat && Number(selectedChat.usersId) === Number(otherUserId);

      if (!chatCurrentlyOpen && !isFromMe) {
        setUnreadMap((prev) => ({
          ...prev,
          [otherUserId]: (prev[otherUserId] || 0) + 1,
        }));
      }

      // 3️⃣ If chat open → append message and mark as read
      if (selectedChat?.groupId === msg.groupId) {
        setMessages((prev) => {
          const filtered = prev.filter(
            (m) =>
              !(
                m.optimistic &&
                m.senderId === msg.senderId &&
                m.message === msg.message
              )
          );
          return [...filtered, msg];
        });

        socket.emit("markAsReadBatch", {
          groupId: msg.groupId,
          usersId: currentUser.usersId,
        });

        // Reset unread instantly
        setUnreadMap((prev) => ({ ...prev, [otherUserId]: 0 }));

        scrollToBottom();
      }
    };

    // ------------------ TYPING ------------------
    const onTyping = ({ usersId }) => {
      setTypingMap((prev) => ({ ...prev, [usersId]: true }));
      setTimeout(() => {
        setTypingMap((prev) => ({ ...prev, [usersId]: false }));
      }, 1200);
    };

    socket.on("receiveMessage", onReceive);
    socket.on("typing", onTyping);

    return () => {
      socket.off("receiveMessage", onReceive);
      socket.off("typing", onTyping);
    };
  }, [selectedChat, currentUser]);

  // =====================================================
  // OPEN CHAT
  // =====================================================
  const openChat = async (contact) => {
    setSelectedChat(contact);
    setMessages([]);

    setUnreadMap((prev) => ({ ...prev, [contact.usersId]: 0 }));

    let groupId = contact.groupId;

    if (!groupId) {
      const res = await createOrGetOneToOneGroup(
        currentUser.usersId,
        contact.usersId
      );
      groupId = res.groupId;

      setContacts((prev) =>
        prev.map((c) =>
          c.usersId === contact.usersId ? { ...c, groupId } : c
        )
      );
    }

    contact.groupId = groupId;

    socket.emit("joinGroup", groupId);

    const res = await getGroupMessages(groupId);
    const list = res.data.map((m) => ({
      ...m,
      senderId: Number(m.senderId),
    }));

    setMessages(list);
    scrollToBottom();

    socket.emit("markAsReadBatch", {
      groupId,
      usersId: currentUser.usersId,
    });
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================
  const handleSend = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    const groupId = selectedChat.groupId;

    let messageType = "text";
    let fileUrl = null;

    if (selectedFile) {
      const uploaded = await uploadFileToCloudinary(selectedFile);
      fileUrl = uploaded.secure_url;
      messageType = selectedFile.type.startsWith("image/")
        ? "image"
        : "file";
    }

    const optimistic = {
      optimistic: true,
      senderId: Number(currentUser.usersId),
      groupId,
      message: inputMessage,
      messageType,
      fileUrl,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    scrollToBottom();

    // Update contacts sidebar
    setContacts((prev) => {
      const updated = prev.map((c) =>
        c.usersId === selectedChat.usersId
          ? {
            ...c,
            lastMessage:
              messageType === "image"
                ? "📷 Photo"
                : inputMessage || (selectedFile ? "📎 File" : ""),
            lastMessageTime: new Date().toISOString(),
          }
          : c
      );

      updated.sort(
        (a, b) =>
          new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
      );

      return updated;
    });

    socket.emit("sendMessage", {
      groupId,
      senderId: Number(currentUser.usersId),
      message: inputMessage,
      messageType,
      fileUrl,
    });

    setInputMessage("");
    setSelectedFile(null);
    setFilePreview(null);
  };

  // =====================================================
  // SEARCH USERS
  // =====================================================
  const handleSearch = async (val) => {
    setSearchText(val);

    if (!val.trim()) {
      setSearchResults([]);
      return;
    }

    const res = await searchUsers(val.trim());
    const list = res.data || [];

    const normalized = list.map((u) => ({
      usersId: Number(u.usersId),
      email: u.email,
      username: u.email.split("@")[0],
      groupId: null,
    }));

    setSearchResults(normalized);
  };

  // =====================================================
  // SCROLL
  // =====================================================
  const scrollToBottom = () => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 40);
  };

  // =====================================================
  // MESSAGE BUBBLE
  // =====================================================
  const MsgBubble = ({ msg }) => {
    const isMine = Number(msg.senderId) === Number(currentUser?.usersId);

    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div
          className={`px-4 py-2 rounded-2xl max-w-[70%] shadow 
          ${isMine ? "bg-blue-600 text-white" : "bg-white text-gray-900"}`}
        >
          {/* IMAGE */}
          {msg.messageType === "image" && msg.fileUrl && (
            <div className="flex flex-col">
              <img
                src={msg.fileUrl}
                alt="img"
                className="max-w-[200px] rounded-lg mb-2 shadow-sm"
              />

              {/* 🔥 Download button for RECEIVER ONLY */}
              {!isMine && (
                <a
                  href={msg.fileUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-xs mt-1"
                >
                  Download
                </a>
              )}
            </div>
          )}

          {/* FILE */}
          {msg.messageType === "file" && msg.fileUrl && (
            <a
              href={msg.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline mb-2 block"
            >
              📄 Download File
            </a>
          )}

          {/* TEXT */}
          {msg.messageType === "text" && (
            <div className="whitespace-pre-wrap">{msg.message}</div>
          )}

          {/* TIME + TICK */}
          <div
            className={`text-[10px] mt-1 ${isMine ? "text-white/80 text-right" : "text-gray-500"
              }`}
          >
            {msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : ""}

            {/* ✓ ticks */}
            {isMine && <span className="ml-2">{msg.optimistic ? "✓" : "✓✓"}</span>}
          </div>
        </div>
      </div>
    );
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Messages</h2>

      {/* SIDEBAR */}
      <aside
        className={`${selectedChat ? "hidden md:flex" : "flex"} 
        w-full md:w-1/3 lg:w-1/4 border-r bg-white flex-col`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chats</h2>
          <input
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full mt-2 px-3 py-2 rounded-full border bg-gray-100"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchText.trim()
            ? searchResults.map((u) => (
              <div
                key={u.usersId}
                onClick={() => openChat(u)}
                className="p-4 border-b hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-semibold">{u.username}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </div>
            ))
            : contacts.map((c) => (
              <div
                key={c.usersId}
                onClick={() => openChat(c)}
                className="p-4 border-b hover:bg-gray-100 cursor-pointer flex justify-between"
              >
                <div>
                  <div className="font-semibold">{c.username}</div>
                  <div className="text-xs text-gray-500">
                    {typingMap[c.usersId] ? (
                      <span className="text-blue-600">typing...</span>
                    ) : (
                      c.lastMessage || c.email
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {c.lastMessageTime && (
                    <div className="text-xs text-gray-400">
                      {new Date(c.lastMessageTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}

                  {unreadMap[c.usersId] > 0 && (
                    <div className="mt-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {unreadMap[c.usersId]}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </aside>

      {/* CHAT AREA */}
      <main
        className={`flex-1 flex flex-col ${selectedChat ? "flex" : "hidden md:flex"
          }`}
      >
        {!selectedChat ? (
          <div className="flex-1 flex justify-center items-center text-gray-500">
            Select a chat to start messaging 💬
          </div>
        ) : (
          <>
            <div className="p-4 border-b bg-white flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <div className="font-semibold text-lg">
                  {selectedChat.username}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedChat.email}
                </div>
              </div>
            </div>

            {/* FILE PREVIEW */}
            {filePreview && (
              <div className="p-3 bg-gray-200 flex items-center justify-between">
                {selectedFile?.type?.startsWith("image/") ? (
                  <img src={filePreview} className="h-24 rounded-lg" />
                ) : (
                  <span className="text-sm font-semibold">
                    📄 {selectedFile?.name}
                  </span>
                )}

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-full"
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100 flex flex-col gap-3">
              {messages.map((msg, idx) => (
                <MsgBubble key={msg.messageId || idx} msg={msg} />
              ))}
              <div ref={messageEndRef} />
            </div>

            {/* TYPING */}
            {typingMap[selectedChat.usersId] && (
              <div className="px-4 py-2 text-sm text-gray-500">
                typing...
              </div>
            )}

            {/* INPUT */}
            <div className="border-t p-3 flex items-center bg-white gap-2">
              <label className="cursor-pointer bg-gray-200 px-3 py-2 rounded-full">
                📎
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSelectedFile(file);
                    setFilePreview(
                      file.type.startsWith("image/")
                        ? URL.createObjectURL(file)
                        : file.name
                    );
                  }}
                />
              </label>

              <input
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);

                  socket.emit("typing", {
                    groupId: selectedChat.groupId,
                    usersId: currentUser.usersId,
                  });
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full"
              />

              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded-full"
              >
                Send
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
