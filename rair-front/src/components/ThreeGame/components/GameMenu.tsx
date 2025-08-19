//@ts-nocheck
import React, {useState} from "react";
import "./GameMenu.css";
import { useAppSelector } from "../../../hooks/useReduxHooks";

interface GameMenuProps {
  onStartGame: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onStartGame }) => {
    const { adminRights, superAdmin, isLoggedIn, loginStatus } = useAppSelector(
        (store) => store.user
      );
    const [login, setLogin] = useState(false);
    
  return (
    <div className="game-menu">
      <div className="menu-container">
        <h1 className="game-title">RAIR Game</h1>
        <button disabled={!isLoggedIn} className="play-button" onClick={onStartGame}>
          {isLoggedIn ? 'Play' : 'Please login'}
        </button>
        <div className="game-instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Use WASD or arrow keys to move</li>
            <li>Collect coins to increase your score</li>
            <li>Press E to interact with draggable objects</li>
            <li>Find the portal to advance to the next level</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameMenu; 