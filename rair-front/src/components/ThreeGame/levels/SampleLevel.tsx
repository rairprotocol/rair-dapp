//@ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { Stats, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import Plane from "../components/Plane";
import Player from "../components/Player";
import Object from "../components/Object";
import Coin from "../components/Coin";
import { mapDataString } from "./../utils/mapDataString";
import { chest, orb } from "./../utils/textureManager";
import { calcDistance } from "../utils/calcDistance";

const mapData = mapDataString(`
# # # # # # # # # # # # # # # # #
# · · · · · · · · · · · · · · · #
# · · · T · · · · · · · · · · · #
# · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · #
# · · · C · · · C · · · C · · · #
# · · · · · C · · · C · · · · · #
# · · · C · · · C · · · C · · · # # # # # # # # # # # # # # # #
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · # 
# · · · C · C · · C C · · · · · · · · · · · · · · · · · · · · # # # # # # # # #
# · · · · · · · · · · · · · · · # · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · # · · · · · · · · · · · · · · · · · · C C C · #
# # # # # # # · · · # # # # # # # · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · # · · · · · · · · · · · · · · # # # # # # # # #
# · · · · · · · · · · · · · · · # · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · # · · · · · · · · · · · · · · #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
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

const SampleLevel = ({ onLevelComplete, onCoinCollect }) => {
  const [colour, setColour] = useState("#7E370C");
  const [currentMap, setCurrentMap] = useState(mapData);
  const { scene } = useThree();

  // Check for portal collision
  useEffect(() => {
    const checkPortalCollision = () => {
      const player = scene.children.find(child => child.name === "Player");
      const portal = scene.children.find(child => child.name === "Portal");
      
      if (player && portal) {
        const distance = calcDistance(player.position, portal.position);
        if (distance < 2) {
          console.log("Portal reached!");
          onLevelComplete();
        }
      }
    };

    const interval = setInterval(checkPortalCollision, 100);
    return () => clearInterval(interval);
  }, [scene, onLevelComplete]);

  const memoizedMapData = useMemo(() => {
    return currentMap.map((row, y) =>
      row.map((type, x) => resolveMapTile(type, x, y, mapData, setCurrentMap, onCoinCollect))
    );
  }, [currentMap, onCoinCollect]);

  console.log("World rendering...");

  return (
    <>
      <Player />
      <Plane position={[0, 0, 0]} colour={colour} />
      <ambientLight intensity={0.1} />
      {memoizedMapData}
      <Object position={[10, 0.5, 20]} texture={orb} />
      <pointLight
        position={[10, 1.1, 20]}
        intensity={3}
        castShadow={true}
        penumbra={1}
        color="blue"
      />
      <Object position={[20, 0.5, 20]} texture={orb} />
      <pointLight
        position={[20, 1.1, 20]}
        intensity={3}
        castShadow={true}
        penumbra={1}
        color="blue"
      />
      <rectAreaLight
        position={[38.5, 1, 11]}
        intensity={5}
        width={2}
        height={2}
        rotation={[0, 20.4, 0]}
        color="yellow"
        name="Portal"
      />
      <spotLight
        position={[20, 20, 20]}
        angle={0.5}
        intensity={1}
        castShadow={true}
        penumbra={1}
      />
      {/*<OrbitControls makeDefault />*/}
      <Stats className="stats" />
    </>
  );
};

export default SampleLevel;