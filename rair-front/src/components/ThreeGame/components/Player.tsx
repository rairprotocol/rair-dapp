//@ts-nocheck
import React, { useRef, useCallback, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import throttle from "lodash-es/throttle";

import {
  playerUpMovement,
  playerDownMovement,
  playerRightMovement,
  playerLeftMovement,
  playerIdleMovement,
} from "../utils/textureManager.ts";
import { useKeyboardControls } from "../hooks/useKeyboardControls.tsx";
import { calcDistance, closestObject } from "../utils/calcDistance";
import Attack from "./Attack";

const Player = () => {
  const { moveForward, moveBackward, moveLeft, moveRight, action } =
    useKeyboardControls();

  const { camera, scene } = useThree();
  const ref = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedObject, setDraggedObject] = useState(null);
  const [nearDraggable, setNearDraggable] = useState(false);

  // Handle key presses to start/stop dragging
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Start dragging with 'E' key when near a draggable object
      if ((e.key === 'e' || e.key === 'E') && nearDraggable && !isDragging) {
        const draggableObjects = scene.children.filter((e) => {
          return calcDistance(e.position, ref.current.position) <= 1.5 && e.name === "Draggable";
        });
        
        if (draggableObjects.length > 0) {
          setIsDragging(true);
          setDraggedObject(draggableObjects[0]);
          console.log("Started dragging object");
        }
      }
      
      // Stop dragging with 'E' or 'Escape' key
      if ((e.key === 'Escape' || e.key === 'e' || e.key === 'E') && isDragging) {
        setIsDragging(false);
        setDraggedObject(null);
        console.log("Released object");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDragging, nearDraggable, scene]);

  const positionControl = useCallback(
    throttle(() => {
      const position = ref.current.position;
      
      // Check if we're near a draggable object
      const draggableObjects = scene.children.filter((e) => {
        return calcDistance(e.position, position) <= 1.5 && e.name === "Draggable";
      });
      
      // Update nearDraggable state
      setNearDraggable(draggableObjects.length > 0);
      
      // If we're dragging an object, move it with the player
      if (isDragging && draggedObject) {
        draggedObject.position.x = position.x;
        draggedObject.position.z = position.z;
      }
      
      // Check for collisions with blocking objects
      const collisions = scene.children.filter((e) => {
        return calcDistance(e.position, position) <= 2 && e.name === "Blocking";
      });

      const topCollisions = collisions.filter((e) => {
        return (
          (e.position.x === Math.ceil(position.x) ||
            e.position.x === Math.floor(position.x)) &&
          e.position.z <= position.z
        );
      });

      const topClosest =
        closestObject(
          topCollisions.map((e) => e.position.z),
          position.z,
          -9999
        ) + 1;

      const bottomCollisions = collisions.filter((e) => {
        return (
          (e.position.x === Math.ceil(position.x) ||
            e.position.x === Math.floor(position.x)) &&
          e.position.z >= position.z
        );
      });

      const bottomClosest =
        closestObject(
          bottomCollisions.map((e) => e.position.z),
          position.z,
          9999
        ) - 1;

      const rightCollisions = collisions.filter((e) => {
        return (
          (e.position.z === Math.ceil(position.z) ||
            e.position.z === Math.floor(position.z)) &&
          e.position.x >= position.x
        );
      });

      const rightClosest =
        closestObject(
          rightCollisions.map((e) => e.position.x),
          position.x,
          9999
        ) - 1;

      const leftCollisions = collisions.filter((e) => {
        return (
          (e.position.z === Math.ceil(position.z) ||
            e.position.z === Math.floor(position.z)) &&
          e.position.x <= position.x
        );
      });

      const leftClosest =
        closestObject(
          leftCollisions.map((e) => e.position.x),
          position.x,
          -9999
        ) + 1;

      // Prevent movement if there's a collision
      if (moveForward && ref.current.position.z <= topClosest) {
        return;
      }

      if (moveBackward && ref.current.position.z >= bottomClosest) {
        return;
      }

      if (moveRight && ref.current.position.x >= rightClosest) {
        return;
      }

      if (moveLeft && ref.current.position.x <= leftClosest) {
        return;
      }

      // If no collision, allow movement
      if (moveForward) {
        ref.current.position.z = Number(
          (ref.current.position.z - 0.1).toFixed(2)
        );
      }

      if (moveBackward) {
        ref.current.position.z = Number(
          (ref.current.position.z + 0.1).toFixed(2)
        );
      }

      if (moveRight) {
        ref.current.position.x = Number(
          (ref.current.position.x + 0.1).toFixed(2)
        );
      }

      if (moveLeft) {
        ref.current.position.x = Number(
          (ref.current.position.x - 0.1).toFixed(2)
        );
      }

      camera?.position.set(ref.current.position.x, 5, ref.current.position.z);
    }, 5),
    [moveForward, moveBackward, moveRight, moveLeft, isDragging, draggedObject]
  );

  // Check if we should stop dragging
  useEffect(() => {
    const checkDragging = () => {
      if (isDragging && draggedObject) {
        const position = ref.current.position;
        const distance = calcDistance(draggedObject.position, position);
        
        if (distance > 2) {
          setIsDragging(false);
          setDraggedObject(null);
          console.log("Stopped dragging object");
        }
      }
    };
    
    const interval = setInterval(checkDragging, 100);
    return () => clearInterval(interval);
  }, [isDragging, draggedObject]);

  useFrame(positionControl);

  const calculateImage = () => {
    if (moveForward) {
      return playerUpMovement;
    }

    if (moveBackward) {
      return playerDownMovement;
    }

    if (moveRight) {
      return playerRightMovement;
    }

    if (moveLeft) {
      return playerLeftMovement;
    }

    return playerIdleMovement;
  };

  return (
    <>
      <mesh position={[2, 0.5, 2]} ref={ref} name="Player">
        <boxGeometry attach="geometry" />
        <meshStandardMaterial
          attach="material"
          transparent={true}
          map={calculateImage()}
        />
        {action && <Attack />}
      </mesh>
    </>
  );
};

export default Player;