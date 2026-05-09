import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Singleton socket — one connection shared across the app.
// Created outside the hook so it isn't recreated on re-renders.
let socket;

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect only once — reuse existing socket if already connected
    if (!socket || !socket.connected) {
      socket = io("http://localhost:3001");
    }

    socketRef.current = socket;

    // Cleanup on unmount — disconnect and nullify
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  return socketRef;
}
