import React, { useState } from "react";
import StartNewGameButton from "./StartNewGameButton";
import JoinGameInputField from "./JoinGameInputField";

function HomePage() {
  const defaultSettings = {};
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <div className="flex flex-col items-center justify-center max-h-screen">
      <h1 className="pt-40 p-10 text-7xl sm:text-8xl md:text-9xl lg:text-9xl xl:text-10xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-fail bg-secondary-dark tracking-widest leading-none">
        Party House
      </h1>
      <JoinGameInputField/>
      <StartNewGameButton settings={settings} />
    </div>
  );
}
export default HomePage;
