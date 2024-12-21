import React, { useState, useEffect } from "react";

export default function PreStartPage(props: any) {
  const {
    ws,
    sendMessage,
    lobbyCode,
    clientId,
    gameState,
    readyUp,
    selectRole,
  } = props;

  const [role, setRole] = useState<string>(""); // "player" or "observer"
  const [isReady, setIsReady] = useState<boolean>(false); // Player readiness state
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  useEffect(() => {
    if (gameState?.clientState) {
      setRole(gameState.clientState.role || "");
      setIsReady(gameState.clientState.isReady || false);
    }
  }, [gameState]);

  const handleRoleSelect = (selectedRole: string) => {
    if (role !== selectedRole) {
      setRole(selectedRole);

      if (selectedRole === "observer") {
        setIsReady(false);
        readyUp(false); // Notify backend
      }

      selectRole(selectedRole); 
    }
  };

  const toggleReadyState = () => {
    if (role === "player") {
      const newReadyState = !isReady;
      setIsReady(newReadyState);
      readyUp(newReadyState); // Notify backend of readiness state change
    }
  };

  // Handle copy link
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
        Lobby {lobbyCode}
      </h1>

      <h2 className="text-xl sm:text-2xl font-medium text-primary">
        Players ready: {gameState.playersReady} / {gameState.playerCount}
      </h2>

      <h3 className="text-lg font-medium">
        Observers: {gameState.observers.length}
      </h3>

      <h3 className="text-lg font-medium">
        Players: {gameState.players.length}
      </h3>
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

        {/* Role Selection Buttons */}
        <div className="flex flex-col space-y-4">
          <button
            className={`w-10/12 sm:w-96 h-16 text-base-100 text-lg sm:text-xl font-semibold rounded-lg p-4 transition-all ${
              role === "player"
                ? "bg-primary hover:bg-primary-dark"
                : "bg-secondary hover:bg-secondary-dark"
            }`}
            onClick={() => handleRoleSelect("player")}
          >
            I'm a Player
          </button>
          <button
            className={`w-10/12 sm:w-96 h-16 text-base-100 text-lg sm:text-xl font-semibold rounded-lg p-4 transition-all ${
              role === "observer"
                ? "bg-primary hover:bg-primary-dark"
                : "bg-secondary hover:bg-secondary-dark"
            }`}
            onClick={() => handleRoleSelect("observer")}
          >
            I'm an Observer
          </button>
        </div>

        {/* Ready/Unready Button */}
        {role === "player" && (
          <button
            className={`w-10/12 sm:w-96 h-16 text-base-100 text-lg sm:text-xl font-semibold rounded-lg p-4 transition-all ${
              isReady
                ? "bg-success hover:bg-success-dark"
                : "bg-accent hover:bg-accent-dark"
            }`}
            onClick={toggleReadyState}
          >
            {isReady ? "Unready" : "Ready"}
          </button>
        )}
      </div>
    </div>
  );
}
