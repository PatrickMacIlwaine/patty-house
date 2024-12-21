import { WebSocketServer } from 'ws';
import {
  addClientToLobby,
  getLobby,
  updateClients,
  setClientRole,
  toggleClientReady,
} from './lobbyService';

export const createWebSocketServer = (server: any) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    // Parse lobbyCode and clientId from the request
    const requestUrl = new URL(`http://${req.headers.host}${req.url ?? '/'}`);
    const lobbyCode = requestUrl.searchParams.get('lobbyCode');
    const clientId = requestUrl.searchParams.get('clientId');

    console.log(
      `New connection attempt. LobbyCode: ${lobbyCode}, ClientId: ${clientId}`
    );

    if (!lobbyCode || !clientId) {
      console.error('Missing lobbyCode or clientId, closing connection.');
      ws.close(1008, 'Lobby code and Client ID are required');
      return;
    }

    // Validate lobby existence
    const lobby = getLobby(lobbyCode);
    if (!lobby) {
      console.error(`Lobby ${lobbyCode} does not exist.`);
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Lobby does not exist',
        })
      );
      ws.close(1008, 'Invalid lobby code');
      return;
    }

    // Add client to the lobby
    try {
      addClientToLobby(lobbyCode, ws, clientId);
      console.log(
        `Client ${clientId} successfully connected to lobby ${lobbyCode}`
      );
    } catch (error) {
      console.error(`Error adding client ${clientId} to lobby:`, error);
      ws.close(1011, 'Internal server error');
      return;
    }

    // Handle incoming messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case 'selectRole':
            if (!['player', 'observer'].includes(message.role)) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  message: 'Invalid role. Must be "player" or "observer".',
                })
              );
              break;
            }
            setClientRole(lobbyCode, clientId, message.role);
          
            break;

          case 'toggleReady':
            if (typeof message.isReady !== 'boolean') {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  message: '"isReady" must be a boolean.',
                })
              );
              break;
            }
            toggleClientReady(lobbyCode, clientId, message.isReady);
            break;

          default:
            console.warn(`Unknown message type received: ${message.type}`);
            ws.send(
              JSON.stringify({
                type: 'error',
                message: `Unknown message type: ${message.type}`,
              })
            );
        }
      } catch (error) {
        console.error('Error processing incoming message:', error);
        ws.send(
          JSON.stringify({
            type: 'error',
            message: 'Invalid message format',
          })
        );
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log(`Client ${clientId} disconnected from lobby ${lobbyCode}`);
      const lobby = getLobby(lobbyCode);
      if (lobby) {
        lobby.clients.delete(clientId);
        updateClients(lobbyCode);
      }
    });

    // Handle errors on the WebSocket
    ws.on('error', (error) => {
      console.error(`Error on WebSocket for client ${clientId}:`, error);
    });
  });

  console.log('WebSocket server is running.');
};
