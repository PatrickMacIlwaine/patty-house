import React, { useState } from "react";

export default function PreStartPage(props: any) {
  const { ws, sendMessage, lobbyCode, clientId, gameState } = props;

  const [showReadyButton, setShowReadyButton] = useState<boolean>(true);
  const [showUserReady, setShowUserReady] = useState<boolean>();
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const handleReadyClick = () => {
    setShowReadyButton(false);
    setShowUserReady(true);

    if (ws && ws.readyState === WebSocket.OPEN) {
      sendMessage(
        JSON.stringify({
          type: "ready",
          lobbyCode,
          clientId,
        }),
      );
    } else {
      console.log('WebSocket is not open. Cannot send "ready" message.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);

    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-base-100">
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-8">
        Lobby
      </h1>

      <h2 className="text-xl sm:text-2xl font-medium text-primary">
        Players connected: {gameState.playersConnected}
      </h2>
      <h2 className="text-xl sm:text-2xl font-medium text-primary">
        Players ready: {gameState.playersReady} / {gameState.playerCount}
      </h2>

      <div className="py-2 flex items-center">
        {linkCopied ? (
          <div className="text-success">Link copied to clipboard!</div>
        ) : (
          <div className="h-6"></div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-4 m-4 w-full sm:w-auto">
        {!gameState.streamerMode && (
          <button
            className="w-10/12 sm:w-96 h-auto bg-secondary text-base-100 text-lg sm:text-xl font-semibold rounded-lg p-4 hover:bg-secondary-dark transition-all"
            onClick={handleCopyLink}
          >
            <div className="flex flex-col items-center">
              <span>Click to Copy game URL</span>
              <span className="text-sm break-all mt-2">
                {window.location.href}
              </span>
            </div>
          </button>
        )}

        {gameState.streamerMode && (
          <button
            className="w-10/12 sm:w-96 h-32 sm:h-32 bg-secondary text-base-100 text-lg sm:text-xl font-semibold rounded-lg p-4 hover:bg-secondary-dark transition-all"
            onClick={handleCopyLink}
          >
            Click to Copy game URL
          </button>
        )}

        {showReadyButton && (
          <button
            className="w-10/12 sm:w-96 h-32 sm:h-32 bg-accent text-base-100 text-5xl sm:text-5xl font-semibold rounded-lg p-4 hover:bg-secondary-dark transition-all"
            onClick={handleReadyClick}
          >
            Ready
          </button>
        )}
        {showUserReady && (
          <h2 className="text-xl sm:text-2xl font-medium text-accent">
            Waiting for players to ready up
          </h2>
        )}

      </div>
    </div>
  );
}
