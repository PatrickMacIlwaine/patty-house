import React, { useState } from 'react';
import Backdrop from './BackDrop';
import { useNavigate } from 'react-router-dom';
import { time } from 'console';

interface StartNewGameModalProps {
  onClose: () => void;
}

export default function StartNewGameModal({ onClose }: StartNewGameModalProps) {
  const [streamerMode, setStreamerMode] = useState(false);
  const [timeConstraint, setTimeConstraint] = useState(1);
  const [playerCount, setPlayerCount] = useState(2);
  const [loadingSymbol, setLoadingSymbol] = useState(false);

  const navigate = useNavigate();
  const REACT_APP_BACKPORT =
    process.env.REACT_APP_BACKPORT || 'http://localhost:3001';

  const handleCreateLobby = async () => {
    setLoadingSymbol(true);

    try {
      const response = await fetch(`${REACT_APP_BACKPORT}/create-lobby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerCount,
          streamerMode,
          timeConstraint,
        }),
      });
      const data = await response.json();

      if (data.lobbyCode) {
        navigate(`/game/${data.lobbyCode}`);
      }
    } catch (error) {
      console.error('Error creating lobby:', error);
    } finally {
      setLoadingSymbol(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Backdrop onExit={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        {loadingSymbol && <div className="text-xl">Creating Lobby...</div>}

        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold">Game Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          ></button>
        </div>

        <div className="mt-4">
          <p className="text-gray-700">Configure your game settings here.</p>

          <div className="mb-4 p-4">
            <div className="flex items-center p-2">
              <label className="mr-2">Streamer Mode:</label>
              <input
                type="checkbox"
                checked={streamerMode}
                onChange={(e) => setStreamerMode(e.target.checked)}
                className="p-2 border rounded size-5 hover:backdrop:blue-"
              />
            </div>
            <div className="flex items-center p-2">
              <label className="mr-2">Time per Round:</label>
              <select
                value={timeConstraint}
                onChange={(e) => setTimeConstraint(parseInt(e.target.value, 10))}
                className="p-2 border rounded"
              >
                {[1, 2, 3, 4, 5].map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center p-2">
              <label className="mr-2">Number of Players:</label>
              <select
                value={playerCount}
                onChange={(e) => setPlayerCount(parseInt(e.target.value, 10))}
                className="p-2 border rounded"
              >
                {[2, 3, 4].map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-accent focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateLobby}
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark focus:outline-none"
          >
            Create Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
