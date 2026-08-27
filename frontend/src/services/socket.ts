import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  return socket;
};

export const subscribeToSignals = (callback: (signal: any) => void) => {
  const sock = initializeSocket();
  sock.on("new_signal", callback);
};

export const subscribeToPairUpdates = (pair: string, callback: (data: any) => void) => {
  const sock = initializeSocket();
  sock.emit("subscribe_pair", pair);
  sock.on(`pair_update_${pair}`, callback);
};

export const unsubscribeFromPair = (pair: string) => {
  const sock = initializeSocket();
  sock.emit("unsubscribe_pair", pair);
};

export const getSocket = () => {
  return socket || initializeSocket();
};

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
