// ChatWindow is the main chat UI.
// Owns all socket listeners -- subscribes on mount, cleans up on unmount.
import { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow({ socket, room, username }) {
  const [message, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Clear messages which switching rooms
    // setMessages([]);
    // setTypingUsers([]);

    // --- Incoming message ---
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // --- System messages (join/leave) ---
    socket.on("system_message", ({ text, timestamp }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "system",
          text,
          timestamp,
        },
      ]);
    });

    // --- Online users list ---
    socket.on("room_users", (users) => {
      setOnlineUsers(users);
    });

    // --- Typing indicators ---
    socket.on("user_typing", ({ username: typingUsers }) => {
      setTypingUsers((prev) =>
        prev.includes(typingUsers) ? prev : [...prev, typingUsers],
      );
    });

    socket.on("user_stop_typing", ({ username: typingUsers }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== typingUsers));
    });

    // Cleanup -- remove all listeners when room changes or component unmount
    // Without this, listeners stack up and messages fire multiple times.
    return () => {
      socket.off("receive_message");
      socket.off("system_message");
      socket.off("room_users");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, [socket, room]); // Re-subscribe whenever room or socket changes

  // Format typing indicator text
  const typingText =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : typingUsers.length > 1
        ? `${typingUsers.join(", ")} are typing..`
        : "";

  if (!room) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
          fontSize: "15px",
        }}
      >
        Select a room to start chatting
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header -- room name + online count */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "16px" }}># {room}</h2>
        <span style={{ fontSize: "13px", color: "#888" }}>
          🟢 {onlineUsers.length} online
        </span>
      </div>
      <MessageList messages={message} currentUser={username} />

      {/* Typing indicator -- only visible when someone is typing */}
      {typingText && (
        <p
          style={{
            margin: 0,
            padding: "0 1rem 4px",
            fontSize: "12px",
            color: "#888",
            fontStyle: "italic",
          }}
        >
          {typingText}
        </p>
      )}
      <MessageInput socket={socket} room={room} username={username} />
    </div>
  );
}
