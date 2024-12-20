import { WebSocket as WsWebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface Lobby {
  clients: Map<string, WsWebSocket>;
  playerCount: number;
  playersConnected: number;
  timeConstraint: number;
  streamerMode: boolean;
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

  lobbies[lobbyCode] = {
    clients: new Map<string, WsWebSocket>(),
    playerCount: playerCount,
    playersConnected: 0,
    timeConstraint,
    streamerMode,
  };
  console.log('created Lobby at ');
  console.log(lobbyCode);

  return lobbyCode;
};

export const getLobby = (lobbyCode: string): Lobby | undefined => {
  return lobbies[lobbyCode];
};

export const addClientToLobby = (
  lobbyCode: string,
  client: WsWebSocket,
  clientId: string
) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    lobby.clients.set(clientId, client);
    lobby.playersConnected = lobby.clients.size;
    updateClients(lobbyCode);
  }
};

export const updateClients = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    lobby.clients.forEach((client, clientId) => {
      const fullState = {
        type: 'fullStateUpdate',
        payload: {
          playerCount: lobby.playerCount,
          playersConnected: lobby.clients.size,
          timeConstraint: lobby.timeConstraint,
          streamerMode: lobby.streamerMode,
        },
      };
      const gameState = JSON.stringify(fullState);
      if (client.readyState === WsWebSocket.OPEN) {
        client.send(gameState);
      }
    });
  }
};
