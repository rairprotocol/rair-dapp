//@ts-nocheck
import { useState, useEffect } from "react";

function actionByValue(key) {
  const value = 10;
  const keys = {
    moveForward: -value,
    moveBackward: value,
    moveLeft: -value,
    moveRight: value,
    action: value,
  };
  return keys[key];
}

function actionByKey(key) {
  const keys = {
    KeyW: "moveForward",
    KeyS: "moveBackward",
    KeyA: "moveLeft",
    KeyD: "moveRight",
    KeyE: "action",
  };
  return keys[key];
}

export const useKeyboardControls = () => {
  const [movement, setMovement] = useState({
    moveForward: 0,
    moveBackward: 0,
    moveLeft: 0,
    moveRight: 0,
    action: 0,
    lastMovement: null,
  });

  useEffect(() => {
    // Primary movements
    const handleKeyDown = (e) => {
      if (actionByKey(e.code)) {
        setMovement((state) => ({
          ...state,
          [actionByKey(e.code)]: actionByValue(actionByKey(e.code)),
          lastMovement: actionByKey(e.code),
        }));
      }
    };
    // Used to reset keys
    const handleKeyUp = (e) => {
      if (actionByKey(e.code)) {
        setMovement((state) => ({
          ...state,
          [actionByKey(e.code)]: 0,
        }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
};