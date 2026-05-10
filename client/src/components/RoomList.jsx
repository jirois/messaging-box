// RoomList lets the user pick a username and join a chat room.
// All socket events originate from here on initial load.

import { useState } from "react";

// Predefined rooms - in a real app these would come from the server
const ROOMS = ["General", "Tech", "Random", "Design"];

export default function RoomList({ socket, onjoin, currentRoom }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleJoin = (room) => {
    if (!username.trim()) {
      setError("Enter a username first");
      return;
    }

    // Emit join_room - server handles leaving previous room automatic
    socket.emit("join_room", { room, username: username.trim() });
    onjoin({ room, username: username.trim() });
    setError("");
  };
  return (
    <div
      style={{
        width: "220px",
        borderRight: "1px solid #e0e0e0",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "16px" }}>Chat Rooms</h2>
      {/* Username input -- required before joining any room */}
      <div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username..."
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "13px",
            boxSizing: "border-box",
          }}
        />
        {error && (
          <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
            {error}
          </p>
        )}
      </div>

      {/* Room button */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {ROOMS.map((room) => (
          <li key={room}>
            <button
              onClick={() => handleJoin(room)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                marginBottom: "4px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                // Highlight the active room
                background: currentRoom === room ? "#4A90E2" : "#f0f0f0",
                color: currentRoom === room ? "#fff" : "#333",
                fontWeight: currentRoom === room ? 600 : 400,
              }}
            >
              # {room}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
