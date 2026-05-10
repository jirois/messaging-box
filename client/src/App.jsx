import { useState } from "react";
import { io } from "socket.io-client";
import RoomList from "./components/RoomList";
import ChatWindow from "./components/ChatWindow";

// Creat socket connection once at module level --
// Prevents reconnecting on every re-render
const socket = io("http://localhost:3001");

export default function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [username, setUsername] = useState("");

  const handleJoin = ({ room, username }) => {
    setCurrentRoom(room);
    setUsername(username);
  };
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <RoomList socket={socket} onjoin={handleJoin} currentRoom={currentRoom} />
      <ChatWindow socket={socket} room={currentRoom} username={username} />
    </div>
  );
}
