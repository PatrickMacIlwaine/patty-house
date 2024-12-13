import { useEffect, useState } from "react";

interface GameState {}

const initialGameState: GameState = {};

export const useWebSocket = (
  lobbyCode: string,
  clientId: string,
  SERVER_URL: string,
) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lobbyCode) return;

    const savedClientId = localStorage.getItem("clientId") || clientId;
    localStorage.setItem("clientId", savedClientId);

    let socket: WebSocket;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      socket = new WebSocket(
        `${SERVER_URL}?lobbyCode=${lobbyCode}&clientId=${savedClientId}`,
      );

      socket.onopen = () => {
        console.log("WebSocket connection established");
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      };

      socket.onerror = (error) => {
        console.log("WebSocket error:", error);
      };

      socket.onmessage = (event) => {
        console.log("Message from server:", event.data);
        const message = JSON.parse(event.data);

        // Handle lobby does not exist error
        if (
          message.type === "error" &&
          message.message === "Lobby does not exist"
        ) {
          console.error(
            "Lobby does not exist. Stopping reconnection attempts.",
          );
          setError(
            "Lobby does not exist. Please check the code or create a new lobby.",
          );
          socket.close(); // Close the WebSocket connection
          return; // Stop any further logic, including reconnection attempts
        }

        // Handle other messages
        else if (
          message.type === "lobbyUpdate" ||
          message.type === "fullStateUpdate"
        ) {
          setGameState((prevState) => ({
            ...prevState,
            ...message.payload,
          }));
        }

        if (message.type === "resetLobby") {
          console.log("Received resetLobby command:", message.payload);
          window.location.reload();
        }
      };

      socket.onclose = () => {
        console.log("WebSocket closed.");

        // If we received a "lobby does not exist" error, don't reconnect
        if (error === "Lobby does not exist") return;

        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          console.log(
            `Attempting to reconnect... (${reconnectAttempts}/${maxReconnectAttempts})`,
          );
          reconnectTimeout = setTimeout(connectWebSocket, 3000); // Retry in 3 seconds
        } else {
          console.log("Max reconnection attempts reached. Stopping.");
        }
      };

      setWs(socket);
    };

    connectWebSocket();

    return () => {
      socket?.close();
      clearTimeout(reconnectTimeout);
      console.log("WebSocket closed and cleanup completed");
    };
  }, [lobbyCode]);

  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  return { ws, gameState, sendMessage, error };
};
