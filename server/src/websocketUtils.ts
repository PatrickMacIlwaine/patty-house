import { WebSocketServer, WebSocket } from 'ws';
import { addClientToLobby, getLobby, updateClients } from './lobbyService';

export const createWebSocketServer = (server: any) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const requestUrl = new URL(`http://${req.headers.host}${req.url ?? '/'}`);
    const lobbyCode = requestUrl.searchParams.get('lobbyCode');
    const clientId = requestUrl.searchParams.get('clientId');

    console.log(
      `New connection attempt. LobbyCode: ${lobbyCode}, ClientId: ${clientId}`
    );

    if (!lobbyCode || !clientId) {
      console.log('Missing lobbyCode or clientId, closing connection.');
      ws.close(1008, 'Lobby code and Client ID are required');
      return;
    }

    const lobby = getLobby(lobbyCode);
    if (!lobby) {
      const errorMessage = JSON.stringify({
        type: 'error',
        message: 'Lobby does not exist',
      });
      ws.send(errorMessage);
      ws.close(1008, 'Invalid lobby code');
      return;
    }
    // checked all conditions for joining the lobby

    addClientToLobby(lobbyCode, ws, clientId);
    console.log(`Client ${clientId} connected to lobby ${lobbyCode}`);

    ws.on('close', () => {
      console.log(`Client ${clientId} disconnected from lobby ${lobbyCode}`);
      const lobby = getLobby(lobbyCode);
      if (lobby) {
        lobby.clients.delete(clientId);
        updateClients(lobbyCode);
      }
    });
  });
};
