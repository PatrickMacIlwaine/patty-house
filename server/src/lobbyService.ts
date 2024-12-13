import { WebSocket as WsWebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface Lobby {
 
}

interface LobbyOptions {
  playerCount: number;
  streamerMode: boolean;
  timeConstraint: number;
}

const lobbies: { [key: string]: Lobby } = {};

export const createLobby = ({
  playerCount,
  streamerMode,
  timeConstraint,
}: LobbyOptions): string => {
    const lobbyCode = uuidv4().slice(0, 5);
    
  return lobbyCode
};


export const getLobby = (lobbyCode: string): Lobby | undefined => {
  return lobbies[lobbyCode];
};
