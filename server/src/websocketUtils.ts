import { WebSocketServer, WebSocket } from 'ws';

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
    })
}