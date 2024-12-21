import { WebSocket as WsWebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface ClientData {
  socket: WsWebSocket;
  gameState: ClientGameState | null;
  isObserver: boolean;
  isReady: boolean; // Ready state for players
}

interface ClientGameState {
  deck: Card[];
  inShop: boolean;
  inGame: boolean;
}

interface Lobby {
  clients: Map<string, ClientData>;
  players: string[]; // Clients who opted to play
  observers: string[]; // Clients who opted to observe
  turnOrder: string[];
  currentTurnIndex: number;
  gameStarted: boolean;
}

interface Card {
  unlockCost: number;
  money: number;
  pop: number;
  danger: number;
  ability: Ability;
}

interface Ability {
  kick: boolean;
  seeNextCard: boolean;
  restartRound: boolean;
}

const lobbies: { [key: string]: Lobby } = {};

// Create a new lobby
export const createLobby = (): string => {
  const lobbyCode = uuidv4().slice(0, 5);

  lobbies[lobbyCode] = {
    clients: new Map<string, ClientData>(),
    players: [],
    observers: [],
    turnOrder: [],
    currentTurnIndex: -1,
    gameStarted: false,
  };

  console.log('Created lobby at:', lobbyCode);
  return lobbyCode;
};

export const getLobby = (lobbyCode: string): Lobby | undefined => {
  return lobbies[lobbyCode];
};

// Handle a client joining the lobby
export const addClientToLobby = (
  lobbyCode: string,
  client: WsWebSocket,
  clientId: string
) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    if (lobby.clients.has(clientId)) {
      console.log(`Client ${clientId} reconnected`);
      const clientData = lobby.clients.get(clientId)!;
      clientData.socket = client; // Update WebSocket instance
      updateClients(lobbyCode);
      return;
    }

    const isObserver = lobby.gameStarted;

    lobby.clients.set(clientId, {
      socket: client,
      gameState: isObserver
        ? null
        : {
            deck: [],
            inShop: false,
            inGame: false,
          },
      isObserver,
      isReady: false,
    });

    if (isObserver) {
      lobby.observers.push(clientId);
    }

    updateClients(lobbyCode);
  }
};

// Handle role assignment ("player" or "observer")
export const setClientRole = (
  lobbyCode: string,
  clientId: string,
  role: 'player' | 'observer'
) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    const client = lobby.clients.get(clientId);
    if (!client || lobby.gameStarted) {
      console.log(`Cannot assign role for client ${clientId}.`);
      return;
    }

    if (client.isObserver) {
      lobby.observers = lobby.observers.filter((id) => id !== clientId);
    } else {
      lobby.players = lobby.players.filter((id) => id !== clientId);
      lobby.turnOrder = lobby.turnOrder.filter((id) => id !== clientId);
    }

    if (role === 'player') {
      client.isObserver = false;
      client.isReady = false; // Reset readiness when switching role
      client.gameState = {
        deck: [],
        inShop: false,
        inGame: false,
      };
      lobby.players.push(clientId);
      lobby.turnOrder.push(clientId);
    } else if (role === 'observer') {
      client.isObserver = true;
      client.isReady = false; // Observers cannot be ready
      client.gameState = null;
      lobby.observers.push(clientId);
    }

    console.log(`Client ${clientId} switched to ${role}`);
    updateClients(lobbyCode);
  }
};

// Set a player's readiness state
export const toggleClientReady = (
  lobbyCode: string,
  clientId: string,
  isReady: boolean
) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    const client = lobby.clients.get(clientId);
    if (!client || client.isObserver || lobby.gameStarted) {
      console.log(`Cannot set ready state for client ${clientId}`);
      return;
    }

    client.isReady = isReady;
    console.log(`Client ${clientId} readiness set to ${isReady}`);

    const readyPlayers = lobby.players.filter((id) => {
      const player = lobby.clients.get(id);
      return player?.isReady;
    });

    if (
      readyPlayers.length >= 2 &&
      readyPlayers.length === lobby.players.length
    ) {
      startGame(lobbyCode);
    } else {
      console.log(
        `Game cannot start yet. ${readyPlayers.length}/${lobby.players.length} players are ready.`
      );
    }

    updateClients(lobbyCode);
  }
};

// Start the game
export const startGame = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    if (lobby.gameStarted) {
      console.log(`Game in lobby ${lobbyCode} has already started.`);
      return;
    }

    const readyPlayers = lobby.players.filter((id) => {
      const player = lobby.clients.get(id);
      return player?.isReady;
    });

    if (readyPlayers.length < 2) {
      console.log(`Not enough players to start the game in lobby ${lobbyCode}`);
      return;
    }

    lobby.gameStarted = true;
    console.log(
      `Game started in lobby ${lobbyCode} with players:`,
      lobby.players
    );

    updateClients(lobbyCode);
  }
};

// Broadcast updated lobby state to all clients
export const updateClients = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    const currentTurnId =
      lobby.turnOrder.length > 0 && lobby.currentTurnIndex >= 0
        ? lobby.turnOrder[lobby.currentTurnIndex]
        : null;

    lobby.clients.forEach(
      ({ socket, gameState, isObserver, isReady }, clientId) => {
        const isActivePlayer = clientId === currentTurnId;

        const message = {
          type: 'gameStateUpdate',
          payload: {
            globalState: {
              players: lobby.players,
              observers: lobby.observers,
              gameStarted: lobby.gameStarted,
              currentTurn: currentTurnId,
            },
            clientState: isActivePlayer ? gameState : null,
            readiness: { clientId, isReady },
          },
        };

        if (socket.readyState === WsWebSocket.OPEN) {
          socket.send(JSON.stringify(message));
        }
      }
    );
  }
};
