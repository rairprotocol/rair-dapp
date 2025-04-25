import { useState, useMemo } from "react";
import { Stats, OrbitControls } from "@react-three/drei";

import Plane from "../components/Plane";
import Player from "../components/Player";
import Object from "../components/Object";
import Coin from "../components/Coin";
import { mapDataString } from "./../utils/mapDataString";
import { chest, orb } from "./../utils/textureManager";

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
# · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · # # # # # # # # #
# · · · · · · · · · · · · · · · # · · · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · # · · · · · · · · · · · · · · · · · · C C C · #
# # # # # # # · · · # # # # # # # · · · · · · · · · · · · · · · · · · · · · · #
· · · · · · · · · · · · · · · · # · · · · · · · · · · · · · · # # # # # # # # #
· · · · · · · · · · · · · · · · # · · · · · · · · · · · · · · #
· · · · · · · · · · · · · · · · # · · · · · · · · · · · · · · #
· · · · · · · · · · · · · · · · # # # # # # # # # # # # # # # #
`);

const resolveMapTile = (type, x, y, mapData, setCurrentMap) => {
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
          name="Blocking"
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
        />
      );
    default:
      return null;
  }
};

const SampleLevel = () => {
  const [colour, setColour] = useState("#7E370C");

  const [currentMap, setCurrentMap] = useState(mapData);

  // Remove this to see performance degradation
  const memoizedMapData = useMemo(() => {
    return currentMap.map((row, y) =>
      row.map((type, x) => resolveMapTile(type, x, y, mapData, setCurrentMap))
    );
  }, [currentMap]);

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
        castShadow={true}
        penumbra={1}
        width={1}
        rotation={[0, 20.4, 0]}
      />
      <spotLight
        position={[10, 10, 10]}
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