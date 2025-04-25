//@ts-nocheck
import { useState, useMemo } from "react";
import { Stats } from "@react-three/drei";

import Plane from "../components/Plane";
import Player from "../components/Player";
import Object from "../components/Object";
import Coin from "../components/Coin";
import { mapDataString } from "../utils/mapDataString";
import { chest, orb } from "../utils/textureManager";

const mapData = mapDataString(`
# # # # # # # # # # # # # # # # #
# · · · · · · · · · · · · · · · #
# · C · · · · · · · · · · C · · #
# · · # # # · · · · · # # # · · #
# · · # · · · · T · · · · # · · #
# · · # · · · · · · · · · # · · #
# · · · · · · · · · · · · · · · #
# · · · · · C · · · C · · · · · #
# · · # · · · · · · · · · # · · #
# · · # · · · · · · · · · # · · #
# · C # · · · · · · · · · # C · #
# · · # # # · · · · · # # # · · #
# · · · · · · · · · · · · · · · #
# # # # # # # # # # # # # # # # #
`);

const resolveMapTile = (type, x, y, mapData, setCurrentMap, onCoinCollect) => {
  const key = `${x}-${y}`;

  switch (type) {
    case "#":
      return (
        <Object
          key={key}
          position={[x, 0.5, y]}
          type="Static"
          name="Blocking"
        />
      );
    case "T":
      return (
        <Object
          key={key}
          position={[x, 0.5, y]}
          texture={chest}
          name="Draggable"
        />
      );
    case "C":
      return (
        <Coin
          key={key}
          position={[x, 0.5, y]}
          mapData={mapData}
          setCurrentMap={setCurrentMap}
          type={type}
          onCollect={onCoinCollect}
        />
      );
    default:
      return null;
  }
};

const SecondLevel = ({ onCoinCollect }) => {
  const [colour, setColour] = useState("#2E8B57");
  const [currentMap, setCurrentMap] = useState(mapData);

  const memoizedMapData = useMemo(() => {
    return currentMap.map((row, y) =>
      row.map((type, x) => resolveMapTile(type, x, y, mapData, setCurrentMap, onCoinCollect))
    );
  }, [currentMap, onCoinCollect]);

  return (
    <>
      <Player />
      <Plane position={[0, 0, 0]} colour={colour} />
      <ambientLight intensity={0.1} />
      {memoizedMapData}
      
      {/* Decorative lights */}
      <Object position={[5, 0.5, 5]} texture={orb} />
      <pointLight
        position={[5, 1.1, 5]}
        intensity={2}
        castShadow={true}
        penumbra={1}
        color="purple"
      />
      
      <Object position={[12, 0.5, 5]} texture={orb} />
      <pointLight
        position={[12, 1.1, 5]}
        intensity={2}
        castShadow={true}
        penumbra={1}
        color="purple"
      />

      {/* Portal light to next level */}
      <rectAreaLight
        position={[8, 1, 2]}
        intensity={5}
        width={2}
        height={2}
        color="green"
        name="Portal"
      />

      <spotLight
        position={[8, 10, 8]}
        angle={0.5}
        intensity={1}
        castShadow={true}
        penumbra={1}
      />
      <Stats className="stats" />
    </>
  );
};

export default SecondLevel; 