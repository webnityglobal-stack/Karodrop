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
} from "@react-three/drei";

import * as THREE from "three";

/* =========================================================
   PLACEMENT CONFIGURATION
========================================================= */

const PLACEMENTS = {
  Front: {
    modelRotation: 0,
    position: [0, 0.05, 0.36],
    rotation: [0, 0, 0],
    scale: [0.42, 0.42, 0.42],
  },

  Back: {
    modelRotation: Math.PI,
    position: [0, 0.05, 0.36],
    rotation: [0, 0, 0],
    scale: [0.42, 0.42, 0.42],
  },

  "Left Chest": {
    modelRotation: 0,
    position: [-0.16, 0.15, 0.38],
    rotation: [0, 0, 0],
    scale: [0.20, 0.20, 0.20],
  },

  "Right Chest": {
    modelRotation: 0,
    position: [0.16, 0.15, 0.38],
    rotation: [0, 0, 0],
    scale: [0.20, 0.20, 0.20],
  },

  "Left Shoulder": {
    modelRotation: 0,
    position: [-0.32, 0.28, 0.30],
    rotation: [0, 0, -0.15],
    scale: [0.17, 0.17, 0.17],
  },

  "Right Shoulder": {
    modelRotation: 0,
    position: [0.32, 0.28, 0.30],
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
   DESIGN OVERLAY
   ---------------------------------------------------------
   IMPORTANT:
   We intentionally do NOT use Drei <Decal> here.

   The previous Decal implementation was causing:

   "Decal must have a Mesh as parent or specify its mesh prop"

   Instead, the uploaded design is rendered as a transparent
   textured plane slightly in front of the T-shirt.
========================================================= */

function DesignOverlay({
  designImage,
  position,
  rotation,
  scale,
}) {
  const texture = useTexture(designImage);

  useEffect(() => {
    if (!texture) return;

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return () => {
      // Do not dispose here.
      // Drei/useTexture manages the texture cache.
    };
  }, [texture]);

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      renderOrder={10}
    >
      <planeGeometry args={[1, 1]} />

      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.01}
        side={THREE.DoubleSide}
        depthTest
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-2}
        toneMapped={false}
      />
    </mesh>
  );
}

/* =========================================================
   T-SHIRT MODEL
========================================================= */

function TshirtModel({
  modelPath,
  designImage,
  placement,
  productColor,
}) {
  const { scene } = useGLTF(modelPath);

  /*
   * Clone and normalize the GLB.
   */
  const { model, modelScale } = useMemo(() => {
    const clonedScene = scene.clone(true);

    /*
     * Apply product color to every mesh material.
     */
    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material) {
        /*
         * Some GLB files can contain multiple materials.
         */
        if (Array.isArray(child.material)) {
          child.material = child.material.map((material) => {
            const clonedMaterial = material.clone();

            if (clonedMaterial.color) {
              clonedMaterial.color.set(
                productColor || "#ffffff"
              );
            }

            clonedMaterial.needsUpdate = true;

            return clonedMaterial;
          });
        } else {
          child.material = child.material.clone();

          if (child.material.color) {
            child.material.color.set(
              productColor || "#ffffff"
            );
          }

          child.material.needsUpdate = true;
        }
      }
    });

    /*
     * Calculate bounding box.
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
      modelScale: normalizedScale,
    };
  }, [scene, productColor]);

  const config =
    PLACEMENTS[placement] ||
    PLACEMENTS.Front;

  return (
    <group scale={modelScale}>
      {/* =================================================
          ACTUAL T-SHIRT
      ================================================= */}

      <primitive object={model} />

      {/* =================================================
          UPLOADED DESIGN
      ================================================= */}

      {designImage && (
        <Suspense fallback={null}>
          <DesignOverlay
            designImage={designImage}
            position={config.position}
            rotation={config.rotation}
            scale={config.scale}
          />
        </Suspense>
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
      target - current >
      Math.PI
    ) {
      target -= Math.PI * 2;
    }

    while (
      target - current <
      -Math.PI
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
          powerPreference: "high-performance",
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

        <ambientLight intensity={1.7} />

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
          autoRotate={false}
          minDistance={2.4}
          maxDistance={5.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI * 2) / 3}
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