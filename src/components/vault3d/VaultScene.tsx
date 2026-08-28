import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { VaultDoorMesh } from './VaultDoorMesh';
import { soundEngine } from '../../utils/soundEngine';

interface VaultSceneProps {
  isUnlocked: boolean;
  onUnlockComplete?: () => void;
  onLockComplete?: () => void;
}

// Internal 3D Controller for Mouse Parallax & Cinematic Camera Transitions
const SceneController: React.FC<{
  isUnlocked: boolean;
  onUnlockComplete?: () => void;
  onLockComplete?: () => void;
}> = ({ isUnlocked, onUnlockComplete, onLockComplete }) => {
  const { camera } = useThree();
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Refs for animated 3D parts
  const wheelRotationRef = useRef<THREE.Group>(null);
  const doorHingeRef = useRef<THREE.Group>(null);
  const boltsRef = useRef<THREE.Group>(null);
  const glowIntensityRef = useRef<THREE.PointLight>(null);

  // Track animation state to prevent overlapping timelines
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasUnlockedRef = useRef(false);

  // Mouse move parallax listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = -(e.clientY / window.innerHeight - 0.5) * 2;
      mousePos.current.targetX = x * 0.4;
      mousePos.current.targetY = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Frame loop for smooth mouse parallax when not transitioning
  useFrame(() => {
    if (!hasUnlockedRef.current) {
      // Smooth lerp mouse parallax
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      camera.position.x = mousePos.current.x;
      camera.position.y = mousePos.current.y;
      camera.lookAt(0, 0, 0);
    }
  });

  // Handle Unlock & Lock GSAP Timeline Orchestration
  useEffect(() => {
    if (isUnlocked && !hasUnlockedRef.current) {
      hasUnlockedRef.current = true;

      // Kill any running timeline
      if (timelineRef.current) timelineRef.current.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          if (onUnlockComplete) onUnlockComplete();
        },
      });
      timelineRef.current = tl;

      // 1. Play tumbler audio sequence
      soundEngine.playTumblerSequence(6, 110);

      // 2. Rotate Hand-Wheel rapidly (acceleration & deceleration)
      if (wheelRotationRef.current) {
        tl.to(
          wheelRotationRef.current.rotation,
          {
            z: Math.PI * 4,
            duration: 1.1,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // 3. Retract locking bolts inward (hydraulic snap)
      if (boltsRef.current) {
        tl.to(
          boltsRef.current.scale,
          {
            x: 0.75,
            y: 0.75,
            duration: 0.45,
            ease: 'back.in(1.7)',
            onStart: () => {
              soundEngine.playHydraulicRelease();
            },
          },
          0.8
        );
      }

      // 4. Swing Door Open on Hinge & Sub Bass Rumble
      if (doorHingeRef.current) {
        tl.to(
          doorHingeRef.current.rotation,
          {
            y: -Math.PI * 0.65, // Swing open 117 degrees
            duration: 1.6,
            ease: 'power3.inOut',
            onStart: () => {
              soundEngine.playSubBassRumble();
            },
          },
          1.1
        );
      }

      // 5. Expand glowing light from within
      if (glowIntensityRef.current) {
        tl.to(
          glowIntensityRef.current,
          {
            intensity: 18,
            duration: 1.2,
            ease: 'power2.out',
          },
          1.3
        );
      }

      // 6. Camera Dolly Forward into the Chamber (Zoom through door)
      tl.to(
        camera.position,
        {
          x: 0,
          y: 0,
          z: -1.2,
          duration: 1.8,
          ease: 'power3.inOut',
        },
        1.2
      );

      // Look straight into core
      tl.to(
        camera.rotation,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.2,
        },
        1.2
      );
    } else if (!isUnlocked && hasUnlockedRef.current) {
      // RE-LOCK TRANSITION
      hasUnlockedRef.current = false;
      if (timelineRef.current) timelineRef.current.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          if (onLockComplete) onLockComplete();
        },
      });
      timelineRef.current = tl;

      // 1. Dolly camera back to hero exterior position
      tl.to(
        camera.position,
        {
          x: 0,
          y: 0,
          z: 5.6,
          duration: 1.4,
          ease: 'power3.inOut',
        },
        0
      );

      // 2. Swing Door closed
      if (doorHingeRef.current) {
        tl.to(
          doorHingeRef.current.rotation,
          {
            y: 0,
            duration: 1.3,
            ease: 'power3.inOut',
            onComplete: () => {
              soundEngine.playSubBassRumble();
            },
          },
          0.3
        );
      }

      // 3. Push locking bolts back out
      if (boltsRef.current) {
        tl.to(
          boltsRef.current.scale,
          {
            x: 1,
            y: 1,
            duration: 0.4,
            ease: 'back.out(2)',
            onStart: () => {
              soundEngine.playTick(1600);
            },
          },
          1.4
        );
      }

      // 4. Reverse dial spin
      if (wheelRotationRef.current) {
        tl.to(
          wheelRotationRef.current.rotation,
          {
            z: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          1.3
        );
      }

      // 5. Reset inner glow
      if (glowIntensityRef.current) {
        tl.to(
          glowIntensityRef.current,
          {
            intensity: 4,
            duration: 0.8,
          },
          1.0
        );
      }
    }
  }, [isUnlocked, onUnlockComplete, onLockComplete, camera]);

  return (
    <>
      <VaultDoorMesh
        wheelRotationRef={wheelRotationRef}
        doorHingeRef={doorHingeRef}
        boltsRef={boltsRef}
        glowIntensityRef={glowIntensityRef}
      />
    </>
  );
};

export const VaultScene: React.FC<VaultSceneProps> = ({
  isUnlocked,
  onUnlockComplete,
  onLockComplete,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 5.6], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        {/* Environment map for realistic metallic reflection */}
        <Environment preset="city" />

        {/* Ambient Dark Fill Light */}
        <ambientLight intensity={0.4} color="#556B8D" />

        {/* Key Spotlight focusing on the Vault Center */}
        <spotLight
          position={[4, 6, 8]}
          angle={0.5}
          penumbra={0.8}
          intensity={3.5}
          color="#FFF8E7"
          castShadow
        />

        {/* Secondary Cool Rim Light on Left */}
        <spotLight
          position={[-7, 2, 5]}
          angle={0.6}
          penumbra={1}
          intensity={2.2}
          color="#38BDF8"
        />

        {/* Warm Golden Bottom Floor Reflection */}
        <directionalLight position={[0, -5, 3]} intensity={0.8} color="#D4AF37" />

        {/* Floating Golden Embers / Dust Particles */}
        <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
          <Sparkles
            count={60}
            scale={7}
            size={2.5}
            speed={0.4}
            color="#D4AF37"
            opacity={0.6}
          />
        </Float>

        {/* Main 3D Vault Mesh & Controller */}
        <SceneController
          isUnlocked={isUnlocked}
          onUnlockComplete={onUnlockComplete}
          onLockComplete={onLockComplete}
        />
      </Canvas>
    </div>
  );
};
