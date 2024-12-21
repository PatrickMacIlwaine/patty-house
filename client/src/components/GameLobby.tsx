import React from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ErrorComponent from "./ErrorComponent";
import PreStartPage from "./PreStartPage";
import InGameLogicHere from "./InGameLogicHere";

export default function GameLobby() {
  const { lobbyCode } = useParams<{ lobbyCode: string }>();
  const clientId = uuidv4();
  const REACT_APP_WS = process.env.REACT_APP_WS_URL || "ws://localhost:3001";
  const navigate = useNavigate();

  const { ws, gameState, sendMessage, error, selectRole, readyUp } =
    useWebSocket(lobbyCode || "", clientId, REACT_APP_WS);

  
  if (!lobbyCode) {
    navigate("/");
    return <div>Invalid lobby code, redirecting...</div>;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!gameState.gameStarted) {
    return (
      <PreStartPage
        gameState={gameState}
        ws={ws}
        sendMessage={sendMessage}
        lobbyCode={lobbyCode}
        clientId={clientId}
        selectRole={selectRole}
        readyUp={readyUp}
      />
    );
  }
  if (gameState.gameStarted) {
    return <InGameLogicHere />;
  }
  return <div></div>;
}
