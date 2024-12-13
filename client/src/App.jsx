import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import GameLobby from './components/GameLobby';
import './styles.css'
import { GameStateProvider } from './hooks/GameStateContext';

function App() {
  return (
    <div>
      <GameStateProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="game/:lobbyCode" element={<GameLobby />} />
        </Routes>
      </GameStateProvider>
    </div>
  );
}

export default App;
