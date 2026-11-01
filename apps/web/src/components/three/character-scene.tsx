'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Shield, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

interface CharacterSceneProps {
  className?: string;
}

export function CharacterScene({ className = '' }: CharacterSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [trackingActive, setTrackingActive] = useState(true);
  const [mode, setMode] = useState<'tracking' | 'inspect'>('tracking');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. WebGL Support Verification
    let glAvailable = false;
    try {
      const testCanvas = document.createElement('canvas');
      glAvailable = !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl2') || testCanvas.getContext('webgl'))
      );
    } catch {
      glAvailable = false;
    }

    if (!glAvailable) {
      setTimeout(() => {
        setIsSupported(false);
      }, 0);
      return;
    }

    // 2. Setup Three.js Scene, Camera, Renderer
    const width = container.clientWidth || 420;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.08);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 3.8);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
    } catch {
      setTimeout(() => {
        setIsSupported(false);
      }, 0);
      return;
    }

    // 3. Realistic 3-Point Cyber Studio Lighting
    // Ambient soft fill
    const ambientLight = new THREE.AmbientLight(0x0a192f, 1.2);
    scene.add(ambientLight);

    // Key Light: Front-Left Electric Cyan
    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.8);
    keyLight.position.set(-2.5, 2.5, 2.5);
    scene.add(keyLight);

    // Fill Light: Front-Right Deep Sapphire Blue
    const fillLight = new THREE.DirectionalLight(0x3b82f6, 2.0);
    fillLight.position.set(2.5, 1.5, 2.0);
    scene.add(fillLight);

    // Rim Light (Backlight): Silhouette grazing Neon Cyan
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 4.5);
    rimLight.position.set(0, 3.0, -3.0);
    scene.add(rimLight);

    // Under-glow: Cyan chest reactor reflection
    const chestGlowLight = new THREE.PointLight(0x00f0ff, 2.5, 2.5);
    chestGlowLight.position.set(0, -0.6, 0.8);
    scene.add(chestGlowLight);

    // 4. Construct Stylized Cybernetic Developer Character
    const characterGroup = new THREE.Group();
    characterGroup.position.set(0, -0.4, 0);
    scene.add(characterGroup);

    // Material Library
    const darkArmorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.85,
    });

    const obsidianPlateMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.15,
      metalness: 0.95,
    });

    const chromeTrimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.1,
      metalness: 0.95,
    });

    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.5,
    });

    const blueGlowMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x2563eb,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.5,
    });

    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x001a2c,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.6,
      roughness: 0.05,
      metalness: 0.9,
      transmission: 0.65,
      thickness: 0.5,
      transparent: true,
      opacity: 0.92,
      ior: 1.5,
    });

    // --- Torso & Chest Armor ---
    const torsoGroup = new THREE.Group();
    characterGroup.add(torsoGroup);

    // Main Chest Chassis
    const chestGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.9, 8);
    const chestMesh = new THREE.Mesh(chestGeo, darkArmorMat);
    chestMesh.position.set(0, -0.7, 0);
    torsoGroup.add(chestMesh);

    // Front Chest Armor Plate
    const plateGeo = new THREE.BoxGeometry(0.75, 0.6, 0.4);
    const plateMesh = new THREE.Mesh(plateGeo, obsidianPlateMat);
    plateMesh.position.set(0, -0.65, 0.2);
    torsoGroup.add(plateMesh);

    // Arc Reactor Core (Developer Energy Cell)
    const reactorRingGeo = new THREE.TorusGeometry(0.14, 0.03, 16, 32);
    const reactorRing = new THREE.Mesh(reactorRingGeo, chromeTrimMat);
    reactorRing.position.set(0, -0.62, 0.41);
    torsoGroup.add(reactorRing);

    const reactorCoreGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.05, 32);
    reactorCoreGeo.rotateX(Math.PI / 2);
    const reactorCore = new THREE.Mesh(reactorCoreGeo, cyanGlowMat);
    reactorCore.position.set(0, -0.62, 0.42);
    torsoGroup.add(reactorCore);

    // Floating Shoulder Armors
    const shoulderGeo = new THREE.BoxGeometry(0.35, 0.22, 0.4);
    const leftShoulder = new THREE.Mesh(shoulderGeo, obsidianPlateMat);
    leftShoulder.position.set(-0.75, -0.45, 0);
    leftShoulder.rotation.set(0, 0, 0.2);
    torsoGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, obsidianPlateMat);
    rightShoulder.position.set(0.75, -0.45, 0);
    rightShoulder.rotation.set(0, 0, -0.2);
    torsoGroup.add(rightShoulder);

    // Shoulder Accent Neon Strips
    const shoulderStripGeo = new THREE.BoxGeometry(0.28, 0.03, 0.41);
    const leftStrip = new THREE.Mesh(shoulderStripGeo, cyanGlowMat);
    leftStrip.position.set(-0.75, -0.38, 0);
    leftStrip.rotation.set(0, 0, 0.2);
    torsoGroup.add(leftStrip);

    const rightStrip = new THREE.Mesh(shoulderStripGeo, cyanGlowMat);
    rightStrip.position.set(0.75, -0.38, 0);
    rightStrip.rotation.set(0, 0, -0.2);
    torsoGroup.add(rightStrip);

    // Cyber Neck Cylinder with Hydraulic Accents
    const neckGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.35, 16);
    const neckMesh = new THREE.Mesh(neckGeo, darkArmorMat);
    neckMesh.position.set(0, -0.15, 0);
    torsoGroup.add(neckMesh);

    const neckRingGeo = new THREE.TorusGeometry(0.22, 0.025, 12, 24);
    neckRingGeo.rotateX(Math.PI / 2);
    const neckRing = new THREE.Mesh(neckRingGeo, blueGlowMat);
    neckRing.position.set(0, -0.12, 0);
    torsoGroup.add(neckRing);

    // --- Articulated Head & Tracking Rig ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.25, 0);
    characterGroup.add(headGroup);

    // Main Cranium / Helmet
    const craniumGeo = new THREE.SphereGeometry(0.5, 32, 24);
    craniumGeo.scale(0.95, 1.15, 1.05);
    const craniumMesh = new THREE.Mesh(craniumGeo, darkArmorMat);
    headGroup.add(craniumMesh);

    // Jaw / Chin Guard
    const jawGeo = new THREE.ConeGeometry(0.38, 0.45, 6);
    jawGeo.rotateX(Math.PI);
    const jawMesh = new THREE.Mesh(jawGeo, obsidianPlateMat);
    jawMesh.position.set(0, -0.3, 0.15);
    jawMesh.scale.set(1.0, 0.8, 0.9);
    headGroup.add(jawMesh);

    // Sleek Curved Holographic Visor
    const visorGeo = new THREE.CylinderGeometry(0.48, 0.47, 0.32, 32, 1, false, -Math.PI / 2.5, Math.PI / 1.25);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.05, 0.12);
    headGroup.add(visorMesh);

    // Visor Chrome Brow Trim
    const browGeo = new THREE.TorusGeometry(0.49, 0.025, 12, 32, Math.PI / 1.2);
    browGeo.rotateX(Math.PI / 2);
    browGeo.rotateZ(Math.PI / 12);
    const browMesh = new THREE.Mesh(browGeo, chromeTrimMat);
    browMesh.position.set(0, 0.22, 0.1);
    headGroup.add(browMesh);

    // --- Dynamic Eye / Optic Tracking Units ---
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.05, 0.38);
    headGroup.add(eyesGroup);

    // Dual Iris Optics
    const irisGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const leftIris = new THREE.Mesh(irisGeo, cyanGlowMat);
    leftIris.position.set(-0.16, 0, 0);
    eyesGroup.add(leftIris);

    const rightIris = new THREE.Mesh(irisGeo, cyanGlowMat);
    rightIris.position.set(0.16, 0, 0);
    eyesGroup.add(rightIris);

    // Pupil Rings
    const pupilRingGeo = new THREE.RingGeometry(0.03, 0.05, 16);
    const leftPupil = new THREE.Mesh(pupilRingGeo, chromeTrimMat);
    leftPupil.position.set(-0.16, 0, 0.06);
    eyesGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilRingGeo, chromeTrimMat);
    rightPupil.position.set(0.16, 0, 0.06);
    eyesGroup.add(rightPupil);

    // Lateral Audio/Sensor Nodes (Left and Right Ear Cyber Nodes)
    const earNodeGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.15, 16);
    earNodeGeo.rotateZ(Math.PI / 2);
    const leftEar = new THREE.Mesh(earNodeGeo, obsidianPlateMat);
    leftEar.position.set(-0.52, 0.05, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earNodeGeo, obsidianPlateMat);
    rightEar.position.set(0.52, 0.05, 0);
    headGroup.add(rightEar);

    const earGlowGeo = new THREE.TorusGeometry(0.08, 0.015, 8, 24);
    earGlowGeo.rotateY(Math.PI / 2);
    const leftEarGlow = new THREE.Mesh(earGlowGeo, cyanGlowMat);
    leftEarGlow.position.set(-0.58, 0.05, 0);
    headGroup.add(leftEarGlow);

    const rightEarGlow = new THREE.Mesh(earGlowGeo, cyanGlowMat);
    rightEarGlow.position.set(0.58, 0.05, 0);
    headGroup.add(rightEarGlow);

    // Holographic Orbiting Data Rings (Stylized AI aura)
    const haloRingGeo = new THREE.TorusGeometry(0.75, 0.01, 16, 64);
    const haloRing1 = new THREE.Mesh(haloRingGeo, cyanGlowMat);
    haloRing1.rotation.set(Math.PI / 3, 0.2, 0);
    characterGroup.add(haloRing1);

    const haloRing2 = new THREE.Mesh(haloRingGeo, blueGlowMat);
    haloRing2.rotation.set(-Math.PI / 3.5, -0.3, 0);
    haloRing2.scale.set(0.88, 0.88, 0.88);
    characterGroup.add(haloRing2);

    // 5. Mouse Tracking State & Physics
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion || !trackingActive) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Calculate normalized vector relative to window center
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      // Clamp target to prevent exaggerated or unnatural snapping
      mouse.targetX = Math.max(-1.2, Math.min(1.2, normX));
      mouse.targetY = Math.max(-1.0, Math.min(1.0, normY));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Animation Loop (60 FPS with natural damping)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return; // Pause GPU workload when tab is inactive

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse coordinate interpolation (Lerp damping)
      mouse.x += (mouse.targetX - mouse.x) * 0.065;
      mouse.y += (mouse.targetY - mouse.y) * 0.065;

      if (!prefersReducedMotion && trackingActive) {
        // Natural Head Yaw (horizontal rotation, max ±25 deg)
        const targetHeadYaw = mouse.x * 0.44;
        // Natural Head Pitch (vertical rotation, max ±15 deg)
        const targetHeadPitch = -mouse.y * 0.26;
        // Natural subtle Roll (counter-tilt, max ±3 deg)
        const targetHeadRoll = -mouse.x * 0.06;

        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadYaw, 0.08);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadPitch, 0.08);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, targetHeadRoll, 0.08);

        // Eye tracking reacts faster (vestibulo-ocular reflex)
        eyesGroup.position.x = mouse.x * 0.07;
        eyesGroup.position.y = 0.05 + mouse.y * 0.05;

        // Subtle organic breathing motion
        const breath = Math.sin(elapsedTime * 1.8) * 0.015;
        torsoGroup.position.y = breath;
        headGroup.position.y = 0.25 + breath * 1.2;

        // Subtle Torso follower rotation (follows head with 25% dampening)
        torsoGroup.rotation.y = THREE.MathUtils.lerp(torsoGroup.rotation.y, targetHeadYaw * 0.25, 0.04);

        // Reactor Core Pulse
        const reactorPulse = 1.8 + Math.sin(elapsedTime * 3.0) * 0.6;
        cyanGlowMat.emissiveIntensity = reactorPulse;
        chestGlowLight.intensity = 1.8 + Math.sin(elapsedTime * 3.0) * 0.8;

        // Holographic Halo Gyro-Rotation
        haloRing1.rotation.z = elapsedTime * 0.25;
        haloRing2.rotation.z = -elapsedTime * 0.35;
      } else {
        // Reduced motion / fallback idle
        characterGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1;
      }

      renderer?.render(scene, camera);
    };

    animate();
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    // 7. Responsive Resizing
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 8. Cleanup & Disposal on Component Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose all scene geometries, materials, and textures
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });

      renderer?.dispose();
      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [trackingActive]);

  // Fallback UI if WebGL is unavailable
  if (!isSupported) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center text-neutral-300 ${className}`}>
        <AlertTriangle className="h-10 w-10 text-cyan-400 mb-3" />
        <h3 className="font-bold text-white text-sm">3D Hardware Acceleration Offline</h3>
        <p className="text-xs text-neutral-400 mt-1 max-w-xs">
          WebGL is disabled or unsupported on this device. Displaying standard interface telemetry.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 3D Canvas Mounting Container */}
      <div
        ref={mountRef}
        className="relative h-[440px] w-full max-w-[420px] cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl border border-cyan-500/30 bg-neutral-950/70 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl"
        title="Interactive 3D Character — Tracks your cursor"
      >
        {/* Ambient Glow Halo behind 3D model */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div className="h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />
          <div className="h-56 w-56 rounded-full bg-blue-600/15 blur-[60px]" />
        </div>

        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/90 text-cyan-400">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2 font-mono text-xs">Initializing 3D Rig...</span>
          </div>
        )}

        {/* HUD Overlay Badges */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-neutral-900/80 px-2.5 py-1 text-[10px] font-mono text-cyan-400 backdrop-blur-md">
            <Eye className="h-3 w-3 animate-pulse text-cyan-400" />
            <span>NEON RIG v7.2</span>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>OPTIC TRACKING</span>
          </div>
        </div>

        {/* HUD Controls */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTrackingActive(!trackingActive)}
            className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[10px] font-mono text-neutral-300 transition hover:border-cyan-500/50 hover:text-cyan-400 backdrop-blur-md"
            title={trackingActive ? 'Pause Mouse Tracking' : 'Resume Mouse Tracking'}
          >
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>{trackingActive ? 'TRACKING: ON' : 'TRACKING: PAUSED'}</span>
          </button>
        </div>

        {/* Subtle Cyber Grid Lines on Canvas */}
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-15" />
      </div>

      {/* Caption & Technical Rig Note */}
      <div className="mt-3 flex items-center justify-between w-full max-w-[420px] px-2 text-[11px] font-mono text-neutral-500">
        <span className="flex items-center gap-1 text-cyan-400/80">
          <Shield className="h-3 w-3" />
          <span>Interactive Vestibulo-Ocular Tracking</span>
        </span>
        <span>60 FPS • WebGL</span>
      </div>
    </div>
  );
}
