import { io, Socket } from "socket.io-client";
import { API_URL } from "../redux/api/baseApi";

let socket: Socket | null = null;

export const createSocket = (userId?: string) => {
  if (!socket) {
    console.log("🔄 Creating new socket connection...");
    socket = io(API_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      autoConnect: false,
      query: userId ? { userId } : {},
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });
  }

  if (userId && socket) {
    socket.io.opts.query = { userId };
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn("⚠️ Socket not created yet. Call createSocket() first.");
  }
  return socket;
};

export const connectSocket = (userId: string) => {
  const socketInstance = createSocket(userId);
  if (socketInstance && !socketInstance.connected) {
    socketInstance.connect();
    console.log("🔌 Connecting socket...");
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    console.log("🔌 Socket disconnected");
  }
};