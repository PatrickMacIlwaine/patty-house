import React, { useState } from 'react';
import StartNewGameModal from './StartNewGameModal';

export default function StartNewGameButton(props: any) {
  const [displayStartModal, setDisplayStartModal] = useState(false);

  const handleClick = () => {
    setDisplayStartModal(!displayStartModal);
  };

  const handleCloseModal = () => {
    setDisplayStartModal(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleClick}
        className="w-80 h-20 bg-secondary text-base-100 text-xl font-semibold rounded-lg p-5 hover:bg-secondary-dark transition-all sm:w-80 sm:h-20 sm:text-xl sm:p-4"
      >
        Start New Game
      </button>
      {displayStartModal && <StartNewGameModal onClose={handleCloseModal} />}
    </div>
  );
}
