// MessageInput handles sending messages and emitting typing indicators.
// Typing events are debounced to avoid flooding the server.

import { useState, useRef } from "react";

export default function MessageInput({ socket, room, username }) {
  const [text, setText] = useState("");

  // Ref stores the timeout id for the typing debounce.
  // useRef instead of useState -- we don't want a re-render when it changes.
  const typingTimeoutRef = useRef();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !room) return;

    socket.emit("send message", { room, message: trimmed });
    setText("");

    // Clear typing indicator immediately after sending
    socket.emit("stop_typing", { room });
    clearTimeout(typingTimeoutRef.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline on Enter
      handleSend();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);

    // Emit typing event immediately on first keystroke
    socket.emit("typing", { room, username });

    // Reset the debounce timer -- stop_typing fires 1.5s after last keystroke

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { room });
    }, 1500);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "1rem",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <input
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={room ? `Message #${room}...` : "Join a room to chat"}
        disabled={!room}
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "1px solid #ccc",
          fontSize: "14px",
          outline: "none",
        }}
      />
      <button
        onClick={handleSend}
        disabled={!room || !text.trim()}
        style={{
          padding: "10px 18px",
          background: "#4A90E2",
          color: "#fff",
          border: "none",
          bprderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Send
      </button>
    </div>
  );
}
