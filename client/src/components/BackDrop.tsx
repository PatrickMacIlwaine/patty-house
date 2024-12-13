import React from 'react';

interface BackdropProps {
  onExit: () => void;
}

function Backdrop({ onExit }: BackdropProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onExit();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75"
      onClick={onExit}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Close or dismiss"
    />
  );
}

export default Backdrop;
