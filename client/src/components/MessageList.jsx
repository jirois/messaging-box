// MessageList renders chat messages and auto-scrolls to the latest one.
//Handles two message types: regular messages and system messages

import { useEffect, useRef } from "react";

const formatTime = (iso) => {
  new Date(iso).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function MessageList({ messages, currentUser }) {
  // Ref attached to a dummy div at the bottom of the list.
  // Scrolling it into view keeps the latest message visible.

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Runs every time a new message arrives

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {messages.map((msg) => {
        // Systme messages - join/leave notifications, centered and muted
        if (msg.type === "systme") {
          return (
            <p
              key={msg.id}
              style={{
                textAlign: "center",
                color: "#aaa",
                fontSize: "12px",
                margin: "4px 0",
              }}
            >
              {msg.text}
            </p>
          );
        }
        // Determine if this message was sent by the current user
        const isOwn = msg.sender === currentUser;

        return (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: "column",
              // Own messages align right, others align left
              alignItems: isOwn ? "flex-end" : "flex-start",
            }}
          >
            {/* Sender name - hidden for own messages */}
            {!isOwn && (
              <span
                style={{ fontSize: "11px", color: "#888", marginBottom: "2px" }}
              >
                {msg.sender}
              </span>
            )}
            <div
              style={{
                maxWidth: "70%",
                padding: "8px 12px",
                borderRadius: "12px",
                fontSize: "14px",
                lineHeight: 1.4,
                // Own messages blue, others light grey
                background: isOwn ? "#4A90E2" : "#f0f0f0",
                color: isOwn ? "#fff" : "#333",
              }}
            >
              {msg.text}
            </div>
            <span style={{ fontSize: "10px", color: "#bbb", marginTop: "2px" }}>
              {formatTime(msg.timestamp)}
            </span>
          </div>
        );
      })}
      {/* Invisible anchor -- scrolled into view on new messages */}
      <div ref={bottomRef} />
    </div>
  );
}
