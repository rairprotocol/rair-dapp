import React, { useCallback, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import throttle from "lodash-es/throttle";

import { coin } from "../utils/textureManager";
import coinSound from "../sounds/coin.wav";
import { calcDistance } from "../utils/calcDistance";

const Coin = ({ position }) => {
  const sound = new Audio(coinSound);

  const ref = useRef();
  const [hide, setHide] = useState(false);
  const { scene, camera } = useThree();

  const coinControl = useCallback(
    throttle(() => {
      if (!hide) {
        // ref.current.lookAt(camera.position);
        const position = ref?.current?.position;

        // this is supposed to be the first object in the scene: tshe player
        const collision =
          calcDistance(scene.children[0].position, position) < 1;

        if (collision) {
          sound.play();
          setHide(true);
        }
      }
    }, 100),
    [hide]
  );

  useFrame(coinControl);

  if (hide) {
    return null;
  }

  return (
    <mesh
      position={position}
      ref={ref}
      name="Coin"
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeBufferGeometry attach="geometry" />
      <meshStandardMaterial
        attach="material"
        transparent={true}
        map={coin}
        depthTest={false}
      />
    </mesh>
  );
};

const isSameType = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type;
};

export default React.memo(Coin, isSameType);