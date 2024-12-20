
import express from 'express';
import cors from 'cors';
import { createWebSocketServer } from './websocketUtils';
import { createLobbyHandler } from './lobbyController';

const app = express();

const PORT = process.env.PORT || 3001; 
app.use(cors());
app.use(express.json());

app.post('/create-lobby', createLobbyHandler);

const server = app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});

createWebSocketServer(server);
console.log('WebSocket server attached to the same Express server.');
