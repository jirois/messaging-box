# Messaging Box App

> A multi-room chat application with live messaging, typing indicators, and online presence.

## What It Does

- Join any chat room with a username
- Send and receive messages in real time across multiple browser tabs
- See who is typing with a live typing indicator
- Track online users per room with an live count
- System messages notify the room when users join, leave, or disconnect
- Switch rooms seamlessly — messages clear, presence updates instantly

## Tech Stack

| Layer     | Tool                     |
| --------- | ------------------------ |
| Client    | React (Vite)             |
| Server    | Node.js + Express        |
| Real-Time | Socket.io                |
| State     | `useState` + `useEffect` |

## Project Structure

```
realtime-chat/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoomList.jsx        # Room picker + username input
│   │   │   ├── ChatWindow.jsx      # Socket listeners, typing indicator
│   │   │   ├── MessageList.jsx     # Auto-scrolling message feed
│   │   │   └── MessageInput.jsx    # Send messages, typing debounce
│   │   ├── App.jsx                 # Socket instance, top-level state
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── index.js                    # Express + Socket.io, room logic
│   └── package.json
└── README.md
```

## Getting Started

**1. Start the server**

```bash
cd server
npm install
node index.js
# Server running on port 3001
```

**2. Start the client**

```bash
cd client
npm install
npm run dev
# Client running on http://localhost:5173
```

**3. Test it**

Open two browser tabs, use different usernames, join the same room and chat.

## How It Works

### Rooms

Socket.io rooms scope messages to a group of connected users.
Joining a new room automatically leaves the previous one server-side.

### Message Flow

```
User types → client emits 'send_message'
  → server receives → io.to(room).emit('receive_message')
    → all clients in room receive and render the message
```

### Typing Indicators

```
User keystroke → emit 'typing'
  → server → socket.to(room).emit('user_typing') → other clients show indicator
1.5s after last keystroke → emit 'stop_typing'
  → server → socket.to(room).emit('user_stop_typing') → indicator clears
```

### Broadcasting

- `io.to(room).emit()` — sends to everyone in the room including sender
- `socket.to(room).emit()` — sends to everyone in the room except sender

## Key Concepts Practiced

- WebSocket communication with Socket.io
- Event-driven architecture — emit and listen vs request/response
- Room-based messaging with `socket.join()` and `io.to(room)`
- Typing debounce with `useRef` + `setTimeout`
- Socket listener cleanup with `socket.off()` to prevent duplicate events
- Running a Node.js backend alongside a React frontend
- Online presence tracking with a `Set` per room

## Roadmap

- [ ] Private direct messages between users
- [ ] Message timestamps on hover
- [ ] Emoji reactions
- [ ] Persist message history with a database
