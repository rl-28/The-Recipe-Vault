import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface VaultDoorMeshProps {
  wheelRotationRef: React.RefObject<THREE.Group | null>;
  doorHingeRef: React.RefObject<THREE.Group | null>;
  boltsRef: React.RefObject<THREE.Group | null>;
  glowIntensityRef: React.RefObject<THREE.PointLight | null>;
}

export const VaultDoorMesh: React.FC<VaultDoorMeshProps> = ({
  wheelRotationRef,
  doorHingeRef,
  boltsRef,
  glowIntensityRef,
}) => {
  // Vault Materials
  const titaniumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#161A24'),
        metalness: 0.92,
        roughness: 0.24,
      }),
    []
  );

  const darkSteelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0A0C12'),
        metalness: 0.95,
        roughness: 0.35,
      }),
    []
  );

  const goldAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        metalness: 0.88,
        roughness: 0.22,
        emissive: new THREE.Color('#3A2A08'),
        emissiveIntensity: 0.2,
      }),
    []
  );

  const chromeBoltMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D0D8E8'),
        metalness: 0.98,
        roughness: 0.15,
      }),
    []
  );

  const glowingPedestalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F5D061'),
        metalness: 0.6,
        roughness: 0.1,
        emissive: new THREE.Color('#F59E0B'),
        emissiveIntensity: 0.9,
      }),
    []
  );

  // Floating crystal inside the vault chamber
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 0.8;
      crystalRef.current.rotation.x += delta * 0.4;
      crystalRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.08;
    }
  });

  // Calculate 16 perimeter rivet positions
  const perimeterRivets = useMemo(() => {
    const rivets = [];
    const count = 20;
    const radius = 2.75;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      rivets.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0.12,
      });
    }
    return rivets;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ============================================================ */}
      {/* 1. INNER VAULT CHAMBER (Behind the door)                      */}
      {/* ============================================================ */}
      <group position={[0, 0, -2.5]}>
        {/* Chamber cylindrical wall */}
        <mesh position={[0, 0, -1]}>
          <cylinderGeometry args={[2.5, 2.5, 4, 32, 1, true]} />
          <meshStandardMaterial
            color="#080B12"
            metalness={0.9}
            roughness={0.4}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Back wall of vault chamber */}
        <mesh position={[0, 0, -3]}>
          <circleGeometry args={[2.5, 32]} />
          <meshStandardMaterial
            color="#0B0E17"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>

        {/* Floating Golden Recipe Crystal Tome */}
        <mesh ref={crystalRef} position={[0, 0, -1.2]}>
          <octahedronGeometry args={[0.55, 0]} />
          <primitive object={glowingPedestalMaterial} attach="material" />
        </mesh>

        {/* Inner glow light */}
        <pointLight
          ref={glowIntensityRef}
          position={[0, 0, -1]}
          color="#F5D061"
          intensity={4}
          distance={10}
          decay={2}
        />

        {/* Light beam / cone effect */}
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 2.4, 3.5, 32, 1, true]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 2. OUTER VAULT FRAME (Fixed Blast Frame)                      */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Massive Outer Heavy Ring */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2.65, 0.32, 24, 64]} />
          <primitive object={darkSteelMaterial} attach="material" />
        </mesh>

        {/* Outer Ring Gold Bevel Trim */}
        <mesh position={[0, 0, 0.08]}>
          <torusGeometry args={[2.88, 0.04, 16, 64]} />
          <primitive object={goldAccentMaterial} attach="material" />
        </mesh>

        <mesh position={[0, 0, 0.08]}>
          <torusGeometry args={[2.42, 0.04, 16, 64]} />
          <primitive object={goldAccentMaterial} attach="material" />
        </mesh>

        {/* Perimeter Industrial Rivets */}
        {perimeterRivets.map((rivet, idx) => (
          <mesh key={idx} position={[rivet.x, rivet.y, rivet.z]}>
            <cylinderGeometry args={[0.065, 0.065, 0.12, 16]} />
            <primitive object={chromeBoltMaterial} attach="material" />
          </mesh>
        ))}

        {/* Heavy Side Hinge Mounting Bracket on Left */}
        <group position={[-2.7, 0, 0.2]}>
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[0.35, 0.6, 0.5]} />
            <primitive object={darkSteelMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -1.2, 0]}>
            <boxGeometry args={[0.35, 0.6, 0.5]} />
            <primitive object={darkSteelMaterial} attach="material" />
          </mesh>
          {/* Hinge Pin */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 3.2, 24]} />
            <primitive object={chromeBoltMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 3. MOVING VAULT DOOR ASSEMBLY (Pivots on Left Hinge)          */}
      {/* ============================================================ */}
      <group position={[-2.65, 0, 0]} ref={doorHingeRef}>
        {/* Offset door center relative to hinge pivot */}
        <group position={[2.65, 0, 0]}>
          {/* Main Heavy Blast Door Disc */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[2.4, 2.4, 0.35, 64]} />
            {/* Rotate cylinder so face points along Z axis */}
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>

          {/* Stepped Inner Layer */}
          <mesh position={[0, 0, 0.18]}>
            <cylinderGeometry args={[2.1, 2.1, 0.08, 64]} />
            <primitive object={darkSteelMaterial} attach="material" />
          </mesh>

          {/* Golden Concentric Rings */}
          <mesh position={[0, 0, 0.23]}>
            <torusGeometry args={[1.9, 0.03, 16, 64]} />
            <primitive object={goldAccentMaterial} attach="material" />
          </mesh>

          <mesh position={[0, 0, 0.23]}>
            <torusGeometry args={[1.3, 0.025, 16, 64]} />
            <primitive object={goldAccentMaterial} attach="material" />
          </mesh>

          <mesh position={[0, 0, 0.23]}>
            <torusGeometry args={[0.75, 0.03, 16, 64]} />
            <primitive object={goldAccentMaterial} attach="material" />
          </mesh>

          {/* ============================================================ */}
          {/* 4. RADIAL LOCKING BOLTS (Retract into door)                  */}
          {/* ============================================================ */}
          <group ref={boltsRef}>
            {/* 4 Heavy Steel Locking Bolts (Top, Right, Bottom, Left-Inner) */}
            {[0, 1, 2, 3].map((i) => {
              const angle = (i * Math.PI) / 2;
              return (
                <group key={i} rotation={[0, 0, angle]}>
                  <mesh position={[2.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.12, 0.12, 0.6, 24]} />
                    <primitive object={chromeBoltMaterial} attach="material" />
                  </mesh>
                  {/* Bolt Housing */}
                  <mesh position={[1.8, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[0.22, 0.5, 0.18]} />
                    <primitive object={goldAccentMaterial} attach="material" />
                  </mesh>
                </group>
              );
            })}
          </group>

          {/* Decorative Mechanical Cog Behind Wheel */}
          <mesh position={[0, 0, 0.24]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.6, 0.6, 0.04, 12]} />
            <primitive object={darkSteelMaterial} attach="material" />
          </mesh>

          {/* ============================================================ */}
          {/* 5. ROTATING VAULT HAND-WHEEL (Spins on Unlock)               */}
          {/* ============================================================ */}
          <group position={[0, 0, 0.28]} ref={wheelRotationRef}>
            {/* Central Wheel Hub */}
            <mesh position={[0, 0, 0.06]}>
              <cylinderGeometry args={[0.3, 0.35, 0.18, 32]} />
              <primitive object={darkSteelMaterial} attach="material" />
            </mesh>

            {/* Gold Central Emblem Cap */}
            <mesh position={[0, 0, 0.16]}>
              <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} />
              <primitive object={goldAccentMaterial} attach="material" />
            </mesh>

            {/* Outer Circular Hand-Wheel Ring */}
            <mesh position={[0, 0, 0.08]}>
              <torusGeometry args={[0.95, 0.05, 20, 48]} />
              <primitive object={goldAccentMaterial} attach="material" />
            </mesh>

            {/* 6 Wheel Spokes */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i * Math.PI) / 3;
              return (
                <group key={i} rotation={[0, 0, angle]}>
                  {/* Spoke Rod */}
                  <mesh position={[0.48, 0, 0.08]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.035, 0.035, 0.95, 16]} />
                    <primitive object={titaniumMaterial} attach="material" />
                  </mesh>
                  {/* Outer Spoke Handle Grip */}
                  <mesh position={[1.1, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.04, 0.045, 0.22, 16]} />
                    <primitive object={chromeBoltMaterial} attach="material" />
                  </mesh>
                  {/* Handle Gold Tip */}
                  <mesh position={[1.22, 0, 0.12]}>
                    <sphereGeometry args={[0.055, 16, 16]} />
                    <primitive object={goldAccentMaterial} attach="material" />
                  </mesh>
                </group>
              );
            })}
          </group>

          {/* Culinary Insignia / Monogram Plaque */}
          <group position={[0, 1.45, 0.2]}>
            <mesh>
              <boxGeometry args={[1.1, 0.35, 0.04]} />
              <primitive object={darkSteelMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <boxGeometry args={[1.02, 0.28, 0.02]} />
              <primitive object={goldAccentMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
