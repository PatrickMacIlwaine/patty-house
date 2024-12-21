import { useEffect, useState } from "react";

interface GameState {
  playersConnected: number;
  playersReady: number;
  playerCount: number;
  currentTurn: string;
  players: { clientId: string; isReady: boolean }[];
  observers: string[];
  gameStarted: boolean;
  clientState?: { role: string; isReady: boolean };
  [key: string]: any;
}

const initialGameState: GameState = {
  playersConnected: 0,
  playersReady: 0,
  playerCount: 0,
  currentTurn: "",
  players: [],
  observers: [],
  gameStarted: false,
};

export const useWebSocket = (
  lobbyCode: string,
  clientId: string,
  SERVER_URL: string,
) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [role, setRole] = useState<string>(""); // Role state
  const [isReady, setIsReady] = useState<boolean>(false); // Readiness state
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
        console.error("WebSocket error:", error);
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case "gameStateUpdate":
              const { globalState, clientState, readiness } = message.payload;

              setGameState((prevState) => ({
                ...prevState,
                ...globalState,
              }));

              if (clientState) {
                setRole(clientState.role || "");
                setIsReady(clientState.isReady || false);
              } else {
                setRole("");
                setIsReady(false);
              }

              break;

            case "error":
              setError(message.message);
              socket.close();
              break;

            default:
              console.warn(`Unknown message type: ${message.type}`);
          }
        } catch (err) {
          console.error("Error processing WebSocket message:", err);
        }
      };

      socket.onclose = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          reconnectTimeout = setTimeout(connectWebSocket, 3000);
        }
      };

      setWs(socket);
    };

    connectWebSocket();

    return () => {
      socket?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [lobbyCode]);

  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  const selectRole = (selectedRole: string) => {
    if (ws) {
      sendMessage(
        JSON.stringify({
          type: "selectRole",
          role: selectedRole,
          lobbyCode,
          clientId,
        }),
      );
    }
  };

  const readyUp = (isReady: boolean) => {
    if (ws) {
      sendMessage(
        JSON.stringify({
          type: "toggleReady",
          isReady,
          lobbyCode,
          clientId,
        }),
      );
    }
  };

  return {
    ws,
    gameState,
    sendMessage,
    error,
    role,
    isReady,
    selectRole,
    readyUp,
  };
};
