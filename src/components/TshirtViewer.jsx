import React, {
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { Canvas, useFrame } from "@react-three/fiber";

import {
  OrbitControls,
  Environment,
  Html,
  useGLTF,
  useTexture,
  Decal,
} from "@react-three/drei";

import * as THREE from "three";

/* =========================================================
   PLACEMENT CONFIGURATION
========================================================= */

const PLACEMENTS = {
  Front: {
    modelRotation: 0,
    position: [0, 0.05, 0.34],
    rotation: [0, 0, 0],
    scale: [0.42, 0.42, 0.42],
  },

  Back: {
    modelRotation: Math.PI,
    position: [0, 0.05, 0.34],
    rotation: [0, 0, 0],
    scale: [0.42, 0.42, 0.42],
  },

  "Left Chest": {
    modelRotation: 0,
    position: [-0.16, 0.15, 0.36],
    rotation: [0, 0, 0],
    scale: [0.20, 0.20, 0.20],
  },

  "Right Chest": {
    modelRotation: 0,
    position: [0.16, 0.15, 0.36],
    rotation: [0, 0, 0],
    scale: [0.20, 0.20, 0.20],
  },

  "Left Shoulder": {
    modelRotation: 0,
    position: [-0.32, 0.28, 0.28],
    rotation: [0, 0, -0.15],
    scale: [0.17, 0.17, 0.17],
  },

  "Right Shoulder": {
    modelRotation: 0,
    position: [0.32, 0.28, 0.28],
    rotation: [0, 0, 0.15],
    scale: [0.17, 0.17, 0.17],
  },
};

/* =========================================================
   LOADER
========================================================= */

function Loader() {
  return (
    <Html center>
      <div className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#012467] shadow-lg">
        Loading 3D T-shirt...
      </div>
    </Html>
  );
}

/* =========================================================
   T-SHIRT MODEL + DECAL
========================================================= */

function TshirtModel({
  modelPath,
  designImage,
  placement,
  productColor,
}) {
  const { scene } = useGLTF(modelPath);

  const meshRef = useRef(null);

  /*
   * Normalize the original GLB.
   *
   * This is important because your downloaded GLB
   * has a very large internal scale.
   */
  const { model, mesh, modelScale } = useMemo(() => {
    const clonedScene = scene.clone(true);

    let targetMesh = null;

    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      if (!targetMesh) {
        targetMesh = child;
      }

      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material) {
        child.material = child.material.clone();

        if (child.material.color) {
          child.material.color.set(
            productColor || "#ffffff"
          );
        }

        child.material.needsUpdate = true;
      }
    });

    /*
     * Calculate model bounding box.
     */
    const box = new THREE.Box3().setFromObject(
      clonedScene
    );

    const size = new THREE.Vector3();

    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    const maxDimension = Math.max(
      size.x,
      size.y,
      size.z
    );

    /*
     * Normalize model to approximately 2.2 units.
     */
    const normalizedScale =
      maxDimension > 0
        ? 2.2 / maxDimension
        : 1;

    /*
     * Move model center to origin.
     */
    clonedScene.position.set(
      -center.x,
      -center.y,
      -center.z
    );

    return {
      model: clonedScene,
      mesh: targetMesh,
      modelScale: normalizedScale,
    };
  }, [scene, productColor]);

  const transparentTexture =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

  /*
   * Always load a texture.
   * If user hasn't uploaded design yet,
   * use a transparent 1x1 texture.
   */
  const texture = useTexture(
    designImage || transparentTexture
  );

  useEffect(() => {
    if (!texture) return;

    texture.colorSpace =
      THREE.SRGBColorSpace;

    texture.anisotropy = 8;

    texture.needsUpdate = true;
  }, [texture]);

  const config =
    PLACEMENTS[placement] ||
    PLACEMENTS.Front;

  return (
    <group
      scale={modelScale}
    >
      {/* =================================================
          ACTUAL T-SHIRT
      ================================================= */}

      <primitive
        object={model}
      />

      {/* =================================================
          ACTUAL 3D DECAL

          Design is projected onto the shirt surface.
      ================================================= */}

      {mesh && designImage && (
        <Decal
          mesh={mesh}
          position={config.position}
          rotation={config.rotation}
          scale={config.scale}
          map={texture}
          transparent
          polygonOffset
          polygonOffsetFactor={-1}
          depthTest
          depthWrite={false}
        />
      )}
    </group>
  );
}

/* =========================================================
   SMOOTH ROTATION
========================================================= */

function RotatingTshirt({
  modelPath,
  designImage,
  placement,
  productColor,
}) {
  const groupRef = useRef(null);

  const targetRotation =
    PLACEMENTS[placement]?.modelRotation || 0;

  useFrame(() => {
    if (!groupRef.current) return;

    let current =
      groupRef.current.rotation.y;

    let target = targetRotation;

    /*
     * Always take shortest rotation path.
     */
    while (
      target - current > Math.PI
    ) {
      target -= Math.PI * 2;
    }

    while (
      target - current < -Math.PI
    ) {
      target += Math.PI * 2;
    }

    groupRef.current.rotation.y =
      THREE.MathUtils.lerp(
        current,
        target,
        0.08
      );
  });

  return (
    <group ref={groupRef}>
      <TshirtModel
        modelPath={modelPath}
        designImage={designImage}
        placement={placement}
        productColor={productColor}
      />
    </group>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TshirtViewers({
  modelPath = "/models/tshirt.glb",
  designImage = "",
  placement = "Front",
  productColor = "#ffffff",
}) {
  const placementName =
    PLACEMENTS[placement]
      ? placement
      : "Front";

  return (
    <div
      className="
        relative
        h-[600px]
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-[#DCE7F2]
        bg-[#F5FAFF]
      "
    >

      {/* =================================================
          TOP LEFT
      ================================================= */}

      <div className="absolute left-4 top-4 z-30">
        <span
          className="
            rounded-full
            bg-white
            px-4
            py-2
            text-xs
            font-semibold
            text-[#012467]
            shadow-md
            ring-1
            ring-[#DCE7F2]
          "
        >
          3D Mockup
        </span>
      </div>

      {/* =================================================
          TOP RIGHT
      ================================================= */}

      <div className="absolute right-4 top-4 z-30">
        <span
          className="
            rounded-full
            bg-[#012467]
            px-4
            py-2
            text-xs
            font-medium
            text-white
            shadow-md
          "
        >
          {placementName}
        </span>
      </div>

      {/* =================================================
          3D CANVAS
      ================================================= */}

      <Canvas
        camera={{
          position: [0, 0, 3.8],
          fov: 35,
          near: 0.01,
          far: 100,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
        }}
        shadows
      >

        {/* Background */}

        <color
          attach="background"
          args={["#F5FAFF"]}
        />

        {/* =================================================
            LIGHTING
        ================================================= */}

        <ambientLight
          intensity={1.7}
        />

        <directionalLight
          position={[4, 7, 5]}
          intensity={3}
          castShadow
        />

        <directionalLight
          position={[-4, 4, 3]}
          intensity={1.5}
        />

        <directionalLight
          position={[0, 3, -4]}
          intensity={1}
        />

        {/* =================================================
            MODEL
        ================================================= */}

        <Suspense fallback={<Loader />}>

          <RotatingTshirt
            modelPath={modelPath}
            designImage={designImage}
            placement={placement}
            productColor={productColor}
          />

          <Environment
            preset="studio"
            environmentIntensity={0.8}
          />

        </Suspense>

        {/* =================================================
            360° CONTROLS
        ================================================= */}

        <OrbitControls
          enablePan={false}
          enableRotate={true}
          enableZoom={true}

          /*
           * No auto rotation.
           * User controls the product.
           */
          autoRotate={false}

          minDistance={2.4}
          maxDistance={5.5}

          minPolarAngle={
            Math.PI / 3
          }

          maxPolarAngle={
            (Math.PI * 2) / 3
          }

          target={[0, 0, 0]}
        />

      </Canvas>

      {/* =================================================
          BOTTOM CONTROL HINT
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-5
          left-1/2
          z-30
          -translate-x-1/2
        "
      >
        <div
          className="
            rounded-full
            bg-white/95
            px-5
            py-2.5
            text-xs
            font-medium
            text-[#5E6B7A]
            shadow-md
            ring-1
            ring-[#DCE7F2]
          "
        >
          360° View • Drag to rotate • Scroll to zoom
        </div>
      </div>

    </div>
  );
}

/* =========================================================
   PRELOAD MODEL
========================================================= */

useGLTF.preload(
  "/models/tshirt.glb"
);