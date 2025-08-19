//@ts-nocheck
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";

import SampleLevel from "./levels/SampleLevel";
import SecondLevel from "./levels/SecondLevel";
import PhysicalMovements from "./components/PhysicalMovements";

import "./index.css";
import GameMenu from "./components/GameMenu";

function Loader() {
  const { progress } = useProgress();
  return <div>loading {progress.toFixed()} %</div>;
}

const ThreeGame = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [coinCount, setCoinCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);


  const renderLevel = () => {
    switch (currentLevel) {
      case 1:
        return <SampleLevel onLevelComplete={() => setCurrentLevel(2)} onCoinCollect={() => setCoinCount(prev => prev + 1)} />;
      case 2:
        return <SecondLevel onCoinCollect={() => setCoinCount(prev => prev + 1)} />;
      default:
        return <SampleLevel onLevelComplete={() => setCurrentLevel(2)} onCoinCollect={() => setCoinCount(prev => prev + 1)} />;
    }
  };


  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return <GameMenu onStartGame={handleStartGame} />;
  }

  return (
    <>
      <div className="coin-counter">
        Coins: {coinCount}
      </div>
      {/* <Loader /> */}
      <PhysicalMovements />
      <Canvas orthographic camera={{ zoom: 50, position: [0, 5, 0] }}>
        {renderLevel()}
      </Canvas>
    </>
  );
};

export default ThreeGame;