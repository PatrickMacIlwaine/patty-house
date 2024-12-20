import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ErrorComponent from './ErrorComponent';
import PreStartPage from './PreStartPage';



export default function GameLobby() {

    const { lobbyCode } = useParams<{ lobbyCode: string }>();
    const clientId = uuidv4();
    const REACT_APP_WS = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';
    const navigate = useNavigate();

    const { ws, gameState, sendMessage, error } = useWebSocket(
      lobbyCode || '',
      clientId,
      REACT_APP_WS
    );

    if (!lobbyCode) {
      navigate("/");
      return <div>Invalid lobby code, redirecting...</div>;
    }

    if (error) {
    return (
      <ErrorComponent
      error={error}
    />)
    }
    
    return (
      <PreStartPage
        gameState={gameState}
        ws={ws}
        sendMessage={sendMessage}
        lobbyCode={lobbyCode}
      />
    );

}