import React, { useRef, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import throttle from "lodash-es/throttle";

import {
  playerUpMovement,
  playerDownMovement,
  playerRightMovement,
  playerLeftMovement,
  playerIdleMovement,
} from "../utils/textureManager";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { calcDistance, closestObject } from "../utils/calcDistance";
import Attack from "./Attack";

const Player = () => {
  const { moveForward, moveBackward, moveLeft, moveRight, action } =
    useKeyboardControls();

  const { camera, scene } = useThree();
  const ref = useRef();

  const positionControl = useCallback(
    throttle(() => {
      const position = ref.current.position;
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

      if (ref.current.position.z > topClosest) {
        if (moveForward) {
          ref.current.position.z = Number(
            (ref.current.position.z - 0.1).toFixed(2)
          );
        }
      }

      if (ref.current.position.z < bottomClosest) {
        if (moveBackward) {
          ref.current.position.z = Number(
            (ref.current.position.z + 0.1).toFixed(2)
          );
        }
      }

      if (ref.current.position.x < rightClosest) {
        if (moveRight) {
          ref.current.position.x = Number(
            (ref.current.position.x + 0.1).toFixed(2)
          );
        }
      }

      if (ref.current.position.x > leftClosest) {
        if (moveLeft) {
          ref.current.position.x = Number(
            (ref.current.position.x - 0.1).toFixed(2)
          );
        }
      }

      camera?.position.set(ref.current.position.x, 5, ref.current.position.z);
    }, 5),
    [moveForward, moveBackward, moveRight, moveLeft]
  );

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
        <boxBufferGeometry attach="geometry" />
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