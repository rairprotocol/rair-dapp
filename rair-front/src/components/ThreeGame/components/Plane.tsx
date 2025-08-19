//@ts-nocheck
import React, { useRef } from "react";

const Plane = (props) => {
  const ref = useRef();
  return (
    <mesh
      position={props.position}
      rotation={[-Math.PI / 2, 0, 0]}
      ref={ref}
      name="plane"
    >
      <planeGeometry attach="geometry" args={[200, 200]} />
      <meshStandardMaterial attach="material" color={props.colour} />
    </mesh>
  );
};

export default Plane;