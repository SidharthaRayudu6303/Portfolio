'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { subscribeCharacterReaction, CharacterReaction } from '@/lib/character-state';
import { Bot } from 'lucide-react';

interface CharacterSceneProps {
  className?: string;
}

function checkWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export type RobotExpression = 'idle' | 'happy' | 'excited' | 'curious' | 'thinking' | 'surprised' | 'sleepy';

export function CharacterScene({ className = '' }: CharacterSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSupported] = useState<boolean>(checkWebGLAvailable);

  useEffect(() => {
    if (!isSupported) return;
    const container = mountRef.current;
    if (!container) return;

    // 1. Three.js Scene, Camera, Renderer Setup
    const width = container.clientWidth || 460;
    const height = container.clientHeight || 540;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.04, 3.25);
    camera.lookAt(0, -0.04, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.30;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting Setup
    // Key Light: Electric Cyan-Blue
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    keyLight.position.set(2.4, 3.2, 2.6);
    scene.add(keyLight);

    // Rim Light: Royal Violet
    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 3.4);
    rimLight.position.set(-2.8, 2.0, -2.4);
    scene.add(rimLight);

    // Front Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.4);
    fillLight.position.set(0, 0.6, 3.0);
    scene.add(fillLight);

    // Deep Indigo Ambient Light
    const ambientLight = new THREE.AmbientLight(0x0a0f1d, 1.3);
    scene.add(ambientLight);

    // 3. High-Quality PBR Materials
    const whiteShellMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.10,
      metalness: 0.08,
    });

    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.94,
    });

    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.28,
      metalness: 0.88,
    });

    const blueAccentMat = new THREE.MeshStandardMaterial({
      color: 0x2563ff,
      roughness: 0.22,
      metalness: 0.75,
    });

    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 3.2,
      roughness: 0.08,
      toneMapped: false,
    });

    const pupilCoreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 3.8,
      roughness: 0.05,
      toneMapped: false,
    });

    const violetGlowMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 2.0,
      roughness: 0.18,
    });

    const glossyVisorMat = new THREE.MeshStandardMaterial({
      color: 0x05070e,
      roughness: 0.04,
      metalness: 0.40,
    });

    // 4. Assembly Hierarchy
    const rootCompanion = new THREE.Group();
    rootCompanion.position.set(0, -0.05, 0);
    scene.add(rootCompanion);

    // --- A. Holographic Environment & Platform ---
    const platformGroup = new THREE.Group();
    platformGroup.position.set(0, -0.72, 0);
    rootCompanion.add(platformGroup);

    // Holographic Base Rings
    const baseBevel = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.012, 16, 64),
      silverMetalMat
    );
    baseBevel.rotation.x = Math.PI / 2;
    platformGroup.add(baseBevel);

    const floorDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.70, 48),
      new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      })
    );
    floorDisc.rotation.x = -Math.PI / 2;
    platformGroup.add(floorDisc);

    const innerHoloRing1 = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.45, 48),
      cyanGlowMat
    );
    innerHoloRing1.rotation.x = -Math.PI / 2;
    innerHoloRing1.position.y = 0.005;
    platformGroup.add(innerHoloRing1);

    const innerHoloRing2 = new THREE.Mesh(
      new THREE.RingGeometry(0.20, 0.22, 48),
      violetGlowMat
    );
    innerHoloRing2.rotation.x = -Math.PI / 2;
    innerHoloRing2.position.y = 0.008;
    platformGroup.add(innerHoloRing2);

    // Glowing Magnetic Levitation Beam connecting thruster to platform
    const levitationBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.26, 0.42, 24, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.20,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    levitationBeam.position.set(0, 0.21, 0);
    platformGroup.add(levitationBeam);

    // Floating Technology Badges (Code, AI, Cloud, Analytics)
    const techBadgesGroup = new THREE.Group();
    platformGroup.add(techBadgesGroup);

    function createTechBadgeTexture(label: string, symbol: string): THREE.CanvasTexture {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(5, 12, 28, 0.85)';
        ctx.beginPath();
        ctx.roundRect(8, 8, 112, 112, 24);
        ctx.fill();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, 64, 54);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(label, 64, 94);
      }
      return new THREE.CanvasTexture(c);
    }

    const badgeData = [
      { label: 'CODE', symbol: '</>', angle: 0, r: 0.78, y: 0.28 },
      { label: 'AI', symbol: '✦', angle: Math.PI * 0.5, r: 0.82, y: 0.38 },
      { label: 'CLOUD', symbol: '☁', angle: Math.PI, r: 0.78, y: 0.30 },
      { label: 'DATA', symbol: '☵', angle: Math.PI * 1.5, r: 0.82, y: 0.42 },
    ];

    const badges: Array<{ mesh: THREE.Mesh; initialY: number; angle: number; r: number }> = [];

    badgeData.forEach((b) => {
      const tex = createTechBadgeTexture(b.label, b.symbol);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), mat);
      mesh.position.set(Math.cos(b.angle) * b.r, b.y, Math.sin(b.angle) * b.r);
      techBadgesGroup.add(mesh);
      badges.push({ mesh, initialY: b.y, angle: b.angle, r: b.r });
    });

    // Subtle Floating Particle Field
    const particleCount = 70;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.75;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      particleSpeeds[i] = 0.2 + Math.random() * 0.5;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.024,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    rootCompanion.add(particlePoints);

    // --- B. Floating Robot Companion Assembly ---
    const robotBody = new THREE.Group();
    rootCompanion.add(robotBody);

    // 1. Lower Body (Floating Thruster Pod - No conventional legs)
    const thrusterPodGroup = new THREE.Group();
    thrusterPodGroup.position.set(0, -0.36, 0);
    robotBody.add(thrusterPodGroup);

    const podShell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.11, 0.40, 32),
      whiteShellMat
    );
    thrusterPodGroup.add(podShell);

    const podCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      whiteShellMat
    );
    podCap.rotation.x = Math.PI;
    podCap.position.y = -0.20;
    thrusterPodGroup.add(podCap);

    const podTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.242, 0.012, 16, 36),
      silverMetalMat
    );
    podTrim.rotation.x = Math.PI / 2;
    podTrim.position.y = 0.12;
    thrusterPodGroup.add(podTrim);

    const ionCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.18, 24),
      cyanGlowMat
    );
    ionCone.rotation.x = Math.PI;
    ionCone.position.y = -0.24;
    thrusterPodGroup.add(ionCone);

    const ionGlowRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.10, 0.009, 12, 32),
      cyanGlowMat
    );
    ionGlowRing.rotation.x = Math.PI / 2;
    ionGlowRing.position.y = -0.27;
    thrusterPodGroup.add(ionGlowRing);

    // 2. Torso
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.02, 0);
    robotBody.add(torsoGroup);

    const torsoGeo = new THREE.SphereGeometry(0.30, 32, 24);
    torsoGeo.scale(1.0, 1.14, 0.92);
    const torsoMesh = new THREE.Mesh(torsoGeo, whiteShellMat);
    torsoGroup.add(torsoMesh);

    // Metallic side flank plates
    const leftFlank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.14, 0.26, 16),
      silverMetalMat
    );
    leftFlank.position.set(-0.24, 0, 0);
    leftFlank.rotation.z = 0.22;
    leftFlank.scale.set(0.6, 1.0, 0.8);
    torsoGroup.add(leftFlank);

    const rightFlank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.14, 0.26, 16),
      silverMetalMat
    );
    rightFlank.position.set(0.24, 0, 0);
    rightFlank.rotation.z = -0.22;
    rightFlank.scale.set(0.6, 1.0, 0.8);
    torsoGroup.add(rightFlank);

    // Glowing Chest Energy Core Housing & Dynamic Point Light
    const coreHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.092, 0.092, 0.035, 32),
      darkTitaniumMat
    );
    coreHousing.rotation.x = Math.PI / 2;
    coreHousing.position.set(0, 0.04, 0.26);
    torsoGroup.add(coreHousing);

    const coreBezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.094, 0.011, 16, 36),
      silverMetalMat
    );
    coreBezel.position.set(0, 0.04, 0.27);
    torsoGroup.add(coreBezel);

    const chestEnergyCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 24, 20),
      cyanGlowMat
    );
    chestEnergyCore.position.set(0, 0.04, 0.265);
    torsoGroup.add(chestEnergyCore);

    const chestCoreRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.040, 0.005, 12, 24),
      blueAccentMat
    );
    chestCoreRing.position.set(0, 0.04, 0.28);
    torsoGroup.add(chestCoreRing);

    const chestPointLight = new THREE.PointLight(0x00f0ff, 2.5, 2.8);
    chestPointLight.position.set(0, 0.04, 0.35);
    torsoGroup.add(chestPointLight);

    // Neck Collar
    const neckRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.16, 0.07, 24),
      silverMetalMat
    );
    neckRing.position.set(0, 0.32, 0);
    torsoGroup.add(neckRing);

    // 3. Head Assembly
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.52, 0);
    robotBody.add(headGroup);

    // Main rounded white helmet dome
    const helmetGeo = new THREE.SphereGeometry(0.35, 36, 30);
    helmetGeo.scale(1.10, 1.0, 1.05);
    const helmetMesh = new THREE.Mesh(helmetGeo, whiteShellMat);
    headGroup.add(helmetMesh);

    // Aerodynamic crown ridge
    const crestMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.038, 0.055, 0.40),
      silverMetalMat
    );
    crestMesh.position.set(0, 0.33, -0.04);
    headGroup.add(crestMesh);

    // Ear Modules (Headphone Pods)
    function buildEar(isRight: boolean) {
      const earGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      earGroup.position.set(0.37 * sign, 0.02, 0.02);
      earGroup.rotation.y = sign * (Math.PI / 2);

      const pod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.105, 0.115, 0.055, 32),
        silverMetalMat
      );
      pod.rotation.x = Math.PI / 2;
      earGroup.add(pod);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.082, 0.008, 14, 32),
        cyanGlowMat
      );
      ring.position.z = 0.03;
      earGroup.add(ring);

      const centerJewel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.018, 24),
        blueAccentMat
      );
      centerJewel.rotation.x = Math.PI / 2;
      centerJewel.position.z = 0.032;
      earGroup.add(centerJewel);

      return earGroup;
    }

    headGroup.add(buildEar(false));
    headGroup.add(buildEar(true));

    // Curved Glossy Obsidian Visor Display
    const visorGeo = new THREE.SphereGeometry(0.32, 32, 24, 0, Math.PI, 0, Math.PI * 0.72);
    visorGeo.scale(1.05, 0.92, 0.94);
    const visorMesh = new THREE.Mesh(visorGeo, glossyVisorMat);
    visorMesh.rotation.x = -0.15;
    visorMesh.position.set(0, -0.01, 0.09);
    headGroup.add(visorMesh);

    const visorBezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.27, 0.011, 16, 40, Math.PI * 1.1),
      silverMetalMat
    );
    visorBezel.rotation.set(-0.25, 0, -Math.PI * 0.55);
    visorBezel.position.set(0, -0.01, 0.27);
    headGroup.add(visorBezel);

    // =========================================================================
    // 4. Physical 3D Eyes & Independent Eye Tracking System
    // =========================================================================
    interface EyeUnit {
      socketGroup: THREE.Group;
      pupilGroup: THREE.Group;
      normalMeshGroup: THREE.Group;
      browGroup: THREE.Group;
      browMesh: THREE.Mesh;
      isRight: boolean;
    }

    function build3DEye(isRight: boolean): EyeUnit {
      const sign = isRight ? 1 : -1;
      const socketGroup = new THREE.Group();
      // Positioned directly on the outer front surface of the visor (Z = 0.380)
      socketGroup.position.set(sign * 0.118, 0.045, 0.380);
      socketGroup.rotation.y = sign * 0.18;
      socketGroup.rotation.x = -0.09;
      socketGroup.renderOrder = 10;

      // Dark recessed socket frame
      const socketBacking = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.068, 0.012, 32),
        darkTitaniumMat
      );
      socketBacking.rotation.x = Math.PI / 2;
      socketGroup.add(socketBacking);

      // Outer glowing cyan LED contour ring
      const socketRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.062, 0.0055, 14, 32),
        cyanGlowMat
      );
      socketRing.position.z = 0.006;
      socketRing.renderOrder = 11;
      socketGroup.add(socketRing);

      // Expressive digital holographic brow/eyelid accent
      const browGroup = new THREE.Group();
      browGroup.position.set(0, 0.082, 0.012);
      socketGroup.add(browGroup);

      const browGeo = new THREE.TorusGeometry(0.050, 0.0050, 12, 24, Math.PI * 0.58);
      const browMesh = new THREE.Mesh(browGeo, cyanGlowMat);
      // Center arch at 90 deg (facing upwards over eye)
      browMesh.rotation.z = Math.PI * 0.5 - (Math.PI * 0.58) / 2;
      browMesh.renderOrder = 12;
      browGroup.add(browMesh);

      // Normal / Focused Eye Assembly (Independent Pupil Group)
      const normalMeshGroup = new THREE.Group();
      normalMeshGroup.position.z = 0.010;
      socketGroup.add(normalMeshGroup);

      const pupilGroup = new THREE.Group();
      normalMeshGroup.add(pupilGroup);

      // Outer cyan glowing iris capsule
      const irisCapsule = new THREE.Mesh(
        new THREE.CylinderGeometry(0.040, 0.040, 0.012, 24),
        cyanGlowMat
      );
      irisCapsule.rotation.x = Math.PI / 2;
      irisCapsule.renderOrder = 11;
      pupilGroup.add(irisCapsule);

      const irisAccentRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.038, 0.0045, 12, 24),
        blueAccentMat
      );
      irisAccentRing.position.z = 0.006;
      irisAccentRing.renderOrder = 12;
      pupilGroup.add(irisAccentRing);

      // Bright glowing white pupil core
      const pupilCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.024, 24, 20),
        pupilCoreMat
      );
      pupilCore.scale.set(0.9, 1.25, 0.4);
      pupilCore.position.z = 0.008;
      pupilCore.renderOrder = 13;
      pupilGroup.add(pupilCore);

      // Dual Anime Specular Catchlights (Crisp White Glow)
      const catchlight1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.007, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      catchlight1.position.set(-0.012, 0.012, 0.018);
      catchlight1.renderOrder = 14;
      pupilGroup.add(catchlight1);

      const catchlight2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.004, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      catchlight2.position.set(0.012, -0.010, 0.018);
      catchlight2.renderOrder = 14;
      pupilGroup.add(catchlight2);

      return {
        socketGroup,
        pupilGroup,
        normalMeshGroup,
        browGroup,
        browMesh,
        isRight,
      };
    }

    const leftEye = build3DEye(false);
    const rightEye = build3DEye(true);
    headGroup.add(leftEye.socketGroup);
    headGroup.add(rightEye.socketGroup);

    // =========================================================================
    // 5. Expressive Animated Digital Mouth (Supports 6 Expressive Geometries)
    // =========================================================================
    const mouthGroup = new THREE.Group();
    // Positioned directly on the front surface of the visor (Z = 0.392, angled flush with visor curve)
    mouthGroup.position.set(0, -0.095, 0.392);
    mouthGroup.rotation.x = -0.26;
    mouthGroup.renderOrder = 15;
    headGroup.add(mouthGroup);

    // 1. Gentle Smile (Idle / Happy, Resume)
    const smileArc = Math.PI * 0.70;
    const mouthSmileMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.042, 0.0055, 12, 28, smileArc),
      cyanGlowMat
    );
    // Center arc at bottom (-PI/2), so both ends curve upwards in a happy smile ∪
    mouthSmileMesh.rotation.z = -Math.PI * 0.5 - smileArc / 2;
    mouthSmileMesh.renderOrder = 15;
    mouthGroup.add(mouthSmileMesh);

    // 2. Excited Smile (Projects)
    const excitedArc = Math.PI * 0.88;
    const mouthExcitedMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.052, 0.0065, 12, 32, excitedArc),
      cyanGlowMat
    );
    mouthExcitedMesh.rotation.z = -Math.PI * 0.5 - excitedArc / 2;
    mouthExcitedMesh.renderOrder = 15;
    mouthExcitedMesh.visible = false;
    mouthGroup.add(mouthExcitedMesh);

    // 3. Curious Mouth (About - cute small inquisitive circular dot)
    const mouthCuriousMesh = new THREE.Group();
    const curiousRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.018, 0.005, 12, 24),
      cyanGlowMat
    );
    curiousRing.renderOrder = 15;
    mouthCuriousMesh.add(curiousRing);
    mouthCuriousMesh.position.set(0.014, -0.004, 0);
    mouthCuriousMesh.visible = false;
    mouthGroup.add(mouthCuriousMesh);

    // 4. Thinking Mouth (Experience, Skills - subtle thoughtful dash)
    const mouthThinkingMesh = new THREE.Group();
    const thinkingDash = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.0045, 0.042, 8, 12),
      cyanGlowMat
    );
    thinkingDash.rotation.z = Math.PI * 0.46;
    thinkingDash.renderOrder = 15;
    mouthThinkingMesh.add(thinkingDash);
    mouthThinkingMesh.position.set(-0.012, -0.004, 0);
    mouthThinkingMesh.visible = false;
    mouthGroup.add(mouthThinkingMesh);

    // 5. Surprised Mouth (Small circular "O")
    const mouthSurprisedMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.028, 0.0055, 12, 24),
      cyanGlowMat
    );
    mouthSurprisedMesh.renderOrder = 15;
    mouthSurprisedMesh.position.set(0, -0.004, 0);
    mouthSurprisedMesh.visible = false;
    mouthGroup.add(mouthSurprisedMesh);

    // 6. Sleepy Mouth (Soft resting horizontal line)
    const mouthSleepyMesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.004, 0.034, 8, 12),
      cyanGlowMat
    );
    mouthSleepyMesh.rotation.z = Math.PI / 2;
    mouthSleepyMesh.renderOrder = 15;
    mouthSleepyMesh.position.set(0, -0.004, 0);
    mouthSleepyMesh.visible = false;
    mouthGroup.add(mouthSleepyMesh);

    const mouthVariants = {
      smile: mouthSmileMesh,
      excited: mouthExcitedMesh,
      curious: mouthCuriousMesh,
      thinking: mouthThinkingMesh,
      surprised: mouthSurprisedMesh,
      sleepy: mouthSleepyMesh,
    };

    function setActiveMouth(activeKey: keyof typeof mouthVariants) {
      Object.entries(mouthVariants).forEach(([key, mesh]) => {
        mesh.visible = key === activeKey;
      });
    }

    // =========================================================================
    // 6. Articulated Mechanical Arms with Improved Two-Hand Anatomy
    // =========================================================================
    interface RobotArmUnit {
      armRoot: THREE.Group;
      shoulder: THREE.Mesh;
      upperArm: THREE.Mesh;
      elbow: THREE.Mesh;
      forearm: THREE.Mesh;
      wrist: THREE.Group;
      hand: THREE.Group;
      fingers: THREE.Group[];
      thumb: THREE.Group;
    }

    function buildRobotArm(isRight: boolean): RobotArmUnit {
      const armRoot = new THREE.Group();
      const sign = isRight ? 1 : -1;
      armRoot.position.set(0.31 * sign, 0.10, 0.02);

      // 1. Ball & Socket Shoulder Joint
      const shoulder = new THREE.Mesh(
        new THREE.SphereGeometry(0.066, 24, 20),
        silverMetalMat
      );
      armRoot.add(shoulder);

      const shoulderCap = new THREE.Mesh(
        new THREE.TorusGeometry(0.068, 0.006, 12, 28),
        cyanGlowMat
      );
      shoulderCap.rotation.y = sign * (Math.PI / 2);
      shoulder.add(shoulderCap);

      // 2. Sleek Upper Arm Sleeve with Energy Channel
      const upperArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.048, 0.18, 20),
        whiteShellMat
      );
      upperArm.position.set(0.025 * sign, -0.098, 0);
      upperArm.rotation.z = -0.18 * sign;
      shoulder.add(upperArm);

      const bicepTrim = new THREE.Mesh(
        new THREE.BoxGeometry(0.010, 0.12, 0.012),
        blueAccentMat
      );
      bicepTrim.position.set(0.040 * sign, 0, 0.028);
      upperArm.add(bicepTrim);

      // 3. Articulated Elbow Cylinder Joint
      const elbow = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.042, 20),
        darkTitaniumMat
      );
      elbow.rotation.x = Math.PI / 2;
      elbow.position.set(0.052 * sign, -0.205, 0.02);
      shoulder.add(elbow);

      const elbowPivotJewel = new THREE.Mesh(
        new THREE.SphereGeometry(0.014, 12, 12),
        cyanGlowMat
      );
      elbowPivotJewel.position.set(0, 0.024 * sign, 0);
      elbow.add(elbowPivotJewel);

      // 4. Forearm Casing with Cyan Accent Inset
      const forearm = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.040, 0.15, 12, 16),
        whiteShellMat
      );
      forearm.position.set(0.075 * sign, -0.305, 0.08);
      forearm.rotation.x = 0.42;
      forearm.rotation.z = -0.12 * sign;
      shoulder.add(forearm);

      const forearmStripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.12, 0.014),
        cyanGlowMat
      );
      forearmStripe.position.set(0.038 * sign, 0, 0.026);
      forearm.add(forearmStripe);

      // 5. Articulated Wrist Joint & Sensor Ring
      const wrist = new THREE.Group();
      wrist.position.set(0, -0.105, 0);
      forearm.add(wrist);

      const wristCuff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.030, 0.020, 20),
        silverMetalMat
      );
      wrist.add(wristCuff);

      const wristRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.032, 0.005, 12, 24),
        cyanGlowMat
      );
      wristRing.rotation.x = Math.PI / 2;
      wrist.add(wristRing);

      // 6. Cute Rounded Robotic Palm & Distinguishable Fingers
      const hand = new THREE.Group();
      hand.position.set(0, -0.025, 0);
      wrist.add(hand);

      // Rounded Palm
      const palm = new THREE.Mesh(
        new THREE.SphereGeometry(0.034, 20, 16),
        whiteShellMat
      );
      palm.scale.set(1.0, 0.85, 0.65);
      hand.add(palm);

      // Back of hand metallic armor plate
      const handBackPlate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.025, 0.010, 16),
        silverMetalMat
      );
      handBackPlate.rotation.x = Math.PI / 2;
      handBackPlate.position.set(0, 0, -0.018);
      hand.add(handBackPlate);

      const handStatusJewel = new THREE.Mesh(
        new THREE.SphereGeometry(0.006, 12, 12),
        cyanGlowMat
      );
      handStatusJewel.position.set(0, 0, -0.024);
      hand.add(handStatusJewel);

      // Articulated Thumb
      const thumb = new THREE.Group();
      thumb.position.set(-0.022 * sign, 0.006, 0.008);
      thumb.rotation.set(0.25, 0.35 * sign, -0.45 * sign);
      hand.add(thumb);

      const thumbKnuckle = new THREE.Mesh(
        new THREE.SphereGeometry(0.009, 12, 12),
        silverMetalMat
      );
      thumb.add(thumbKnuckle);

      const thumbProximal = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.0075, 0.016, 6, 8),
        whiteShellMat
      );
      thumbProximal.position.set(0, -0.012, 0.004);
      thumbProximal.rotation.x = 0.35;
      thumb.add(thumbProximal);

      const thumbTip = new THREE.Mesh(
        new THREE.SphereGeometry(0.007, 12, 12),
        cyanGlowMat
      );
      thumbTip.position.set(0, -0.025, 0.010);
      thumb.add(thumbTip);

      // Three Articulated Distinguishable Fingers
      const fingers: THREE.Group[] = [];
      const fingerOffsets = [
        { x: -0.016 * sign, len: 0.024, rotZ: 0.08 * sign },
        { x: 0,             len: 0.028, rotZ: 0 },
        { x: 0.016 * sign,  len: 0.022, rotZ: -0.08 * sign },
      ];

      fingerOffsets.forEach((fo) => {
        const fingerGroup = new THREE.Group();
        fingerGroup.position.set(fo.x, -0.024, 0.002);
        fingerGroup.rotation.z = fo.rotZ;
        fingerGroup.rotation.x = 0.28;
        hand.add(fingerGroup);

        const knuckle = new THREE.Mesh(
          new THREE.SphereGeometry(0.0085, 12, 12),
          silverMetalMat
        );
        fingerGroup.add(knuckle);

        const phalanx = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.0075, fo.len, 6, 8),
          whiteShellMat
        );
        phalanx.position.set(0, -fo.len * 0.5 - 0.004, 0.004);
        fingerGroup.add(phalanx);

        const tipSensor = new THREE.Mesh(
          new THREE.SphereGeometry(0.007, 12, 12),
          cyanGlowMat
        );
        tipSensor.position.set(0, -fo.len - 0.006, 0.006);
        fingerGroup.add(tipSensor);

        fingers.push(fingerGroup);
      });

      return {
        armRoot,
        shoulder,
        upperArm,
        elbow,
        forearm,
        wrist,
        hand,
        fingers,
        thumb,
      };
    }

    const leftArm = buildRobotArm(false);
    const rightArm = buildRobotArm(true);
    torsoGroup.add(leftArm.armRoot);
    torsoGroup.add(rightArm.armRoot);

    // =========================================================================
    // 7. Interaction State & Facial Expression Coordinator
    // =========================================================================
    let currentReaction: CharacterReaction = 'idle';
    let currentSection = 'home';
    let reactionTimer = 0;
    let timeSinceLastCursorMove = 0;
    let surpriseTimer = 0;
    let currentExpression: RobotExpression = 'idle';

    const unsubscribe = subscribeCharacterReaction((reaction) => {
      currentReaction = reaction;
      reactionTimer = 0;
    });

    const handleActiveSection = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id) {
        currentSection = customEvent.detail.id;
      }
    };
    window.addEventListener('active-section-change', handleActiveSection);

    const handleSurpriseClick = () => {
      surpriseTimer = 1.2;
    };
    const heroArea = container.closest('section') || container;
    heroArea.addEventListener('click', handleSurpriseClick);

    // =========================================================================
    // 8. Cursor & Eye Tracking Engine
    // =========================================================================
    let targetCursorX = 0;
    let targetCursorY = 0;
    let currentCursorX = 0;
    let currentCursorY = 0;

    let gazeX = 0;
    let gazeY = 0;

    // Periodic natural blinking state
    let eyeBlinkScale = 1.0;
    let nextBlinkTimer = 2.8;
    let isBlinking = false;
    let blinkProgress = 0;

    // Facial expression interpolation targets
    let currentEyeScaleX = 1.0;
    let currentEyeScaleY = 1.0;
    let currentEyeSlant = 0.0;
    let currentLeftBrowY = 0.082;
    let currentRightBrowY = 0.082;
    let currentLeftBrowRotZ = 0.0;
    let currentRightBrowRotZ = 0.0;
    let currentGlowIntensity = 3.0;

    const handleMouseMove = (e: MouseEvent) => {
      timeSinceLastCursorMove = 0;
      const rect = container.getBoundingClientRect();
      const heroRect = heroArea.getBoundingClientRect();

      if (
        e.clientX >= heroRect.left &&
        e.clientX <= heroRect.right &&
        e.clientY >= heroRect.top &&
        e.clientY <= heroRect.bottom
      ) {
        targetCursorX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetCursorY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetCursorX = Math.max(-1.3, Math.min(1.3, targetCursorX));
        targetCursorY = Math.max(-1.3, Math.min(1.3, targetCursorY));
      } else {
        targetCursorX = 0;
        targetCursorY = 0;
      }
    };

    const handleMouseLeave = () => {
      targetCursorX = 0;
      targetCursorY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // =========================================================================
    // 9. Kinetic 60fps Animation Loop with Real-Time Expression Engine
    // =========================================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      timeSinceLastCursorMove += delta;
      reactionTimer += delta;

      // --- A. Determine Robot Facial Expression from Context ---
      let targetExpression: RobotExpression = 'idle';

      if (surpriseTimer > 0) {
        surpriseTimer -= delta;
        targetExpression = 'surprised';
      } else if (currentReaction === 'surprised') {
        targetExpression = 'surprised';
      } else if (currentReaction !== 'idle') {
        // Priority 1: User is hovering an interactive button or nav link
        if (currentReaction === 'projects') targetExpression = 'excited';
        else if (currentReaction === 'about') targetExpression = 'curious';
        else if (currentReaction === 'skills' || currentReaction === 'experience') targetExpression = 'thinking';
        else if (currentReaction === 'resume' || currentReaction === 'home') targetExpression = 'happy';
        else if (currentReaction === 'contact') targetExpression = 'excited';
      } else {
        // Priority 2: Use current scrolled section or idle timer
        if (timeSinceLastCursorMove > 20.0) {
          targetExpression = 'sleepy';
        } else if (currentSection === 'projects' || currentSection === 'hackathons') {
          targetExpression = 'excited';
        } else if (currentSection === 'about') {
          targetExpression = 'curious';
        } else if (currentSection === 'skills' || currentSection === 'experience' || currentSection === 'certifications') {
          targetExpression = 'thinking';
        } else if (currentSection === 'contact') {
          targetExpression = 'excited';
        } else if (currentSection === 'home') {
          targetExpression = 'happy';
        } else if (Math.abs(currentCursorX) > 0.85 || Math.abs(currentCursorY) > 0.85) {
          targetExpression = 'curious';
        } else {
          targetExpression = 'idle';
        }
      }

      currentExpression = targetExpression;

      // Expression parameters
      let targetEyeScaleX = 1.0;
      let targetEyeScaleY = 1.0;
      let targetEyeSlant = 0.0;
      let targetLeftBrowY = 0.082;
      let targetRightBrowY = 0.082;
      let targetLeftBrowRotZ = 0.0;
      let targetRightBrowRotZ = 0.0;
      let targetGlow = 3.0;
      let targetHeadRollAdd = 0;
      let targetHeadPitchAdd = 0;
      let activeMouthKey: keyof typeof mouthVariants = 'smile';

      switch (currentExpression) {
        case 'excited':
          targetEyeScaleX = 1.22;
          targetEyeScaleY = 1.25;
          targetEyeSlant = 0.08;
          targetGlow = 3.8;
          targetLeftBrowY = 0.096;
          targetRightBrowY = 0.096;
          targetLeftBrowRotZ = -0.14;
          targetRightBrowRotZ = 0.14;
          targetHeadPitchAdd = -0.10;
          activeMouthKey = 'excited';
          break;

        case 'curious':
          targetEyeScaleX = 1.15;
          targetEyeScaleY = 1.14;
          targetEyeSlant = 0.04;
          targetGlow = 3.2;
          targetLeftBrowY = 0.100;
          targetLeftBrowRotZ = -0.18;
          targetRightBrowY = 0.072;
          targetRightBrowRotZ = 0.08;
          targetHeadRollAdd = 0.18;
          targetHeadPitchAdd = -0.05;
          activeMouthKey = 'curious';
          break;

        case 'thinking':
          targetEyeScaleX = 0.94;
          targetEyeScaleY = 0.62;
          targetEyeSlant = -0.06;
          targetGlow = 2.6;
          targetLeftBrowY = 0.068;
          targetRightBrowY = 0.068;
          targetLeftBrowRotZ = 0.22;
          targetRightBrowRotZ = -0.22;
          targetHeadRollAdd = -0.15;
          targetHeadPitchAdd = 0.09;
          activeMouthKey = 'thinking';
          break;

        case 'surprised':
          targetEyeScaleX = 1.34;
          targetEyeScaleY = 1.35;
          targetEyeSlant = 0.0;
          targetGlow = 3.6;
          targetLeftBrowY = 0.106;
          targetRightBrowY = 0.106;
          targetLeftBrowRotZ = 0.0;
          targetRightBrowRotZ = 0.0;
          targetHeadPitchAdd = -0.10;
          activeMouthKey = 'surprised';
          break;

        case 'sleepy':
          targetEyeScaleX = 1.05;
          targetEyeScaleY = 0.32;
          targetEyeSlant = 0.02;
          targetGlow = 1.6;
          targetLeftBrowY = 0.060;
          targetRightBrowY = 0.060;
          targetLeftBrowRotZ = 0.0;
          targetRightBrowRotZ = 0.0;
          targetHeadPitchAdd = 0.13;
          activeMouthKey = 'sleepy';
          break;

        case 'happy':
          targetEyeScaleX = 1.08;
          targetEyeScaleY = 1.02;
          targetEyeSlant = 0.05;
          targetGlow = 3.4;
          targetLeftBrowY = 0.088;
          targetRightBrowY = 0.088;
          targetLeftBrowRotZ = -0.08;
          targetRightBrowRotZ = 0.08;
          activeMouthKey = 'smile';
          break;

        case 'idle':
        default:
          targetEyeScaleX = 1.0;
          targetEyeScaleY = 1.0;
          targetEyeSlant = 0.03;
          targetGlow = 3.0;
          targetLeftBrowY = 0.082;
          targetRightBrowY = 0.082;
          targetLeftBrowRotZ = -0.05;
          targetRightBrowRotZ = 0.05;
          activeMouthKey = 'smile';
          break;
      }

      // Smooth facial expression transitions
      const exprLerpSpeed = Math.min(delta * 7.5, 1.0);
      currentEyeScaleX += (targetEyeScaleX - currentEyeScaleX) * exprLerpSpeed;
      currentEyeScaleY += (targetEyeScaleY - currentEyeScaleY) * exprLerpSpeed;
      currentEyeSlant += (targetEyeSlant - currentEyeSlant) * exprLerpSpeed;
      currentLeftBrowY += (targetLeftBrowY - currentLeftBrowY) * exprLerpSpeed;
      currentRightBrowY += (targetRightBrowY - currentRightBrowY) * exprLerpSpeed;
      currentLeftBrowRotZ += (targetLeftBrowRotZ - currentLeftBrowRotZ) * exprLerpSpeed;
      currentRightBrowRotZ += (targetRightBrowRotZ - currentRightBrowRotZ) * exprLerpSpeed;
      currentGlowIntensity += (targetGlow - currentGlowIntensity) * exprLerpSpeed;

      cyanGlowMat.emissiveIntensity = currentGlowIntensity;
      setActiveMouth(activeMouthKey);

      leftEye.browGroup.position.y = currentLeftBrowY;
      leftEye.browGroup.rotation.z = currentLeftBrowRotZ;
      rightEye.browGroup.position.y = currentRightBrowY;
      rightEye.browGroup.rotation.z = currentRightBrowRotZ;

      leftEye.socketGroup.rotation.z = -currentEyeSlant;
      rightEye.socketGroup.rotation.z = currentEyeSlant;

      // --- B. Smooth Cursor & Eye Interpolation ---
      currentCursorX += (targetCursorX - currentCursorX) * Math.min(delta * 4.5, 1.0);
      currentCursorY += (targetCursorY - currentCursorY) * Math.min(delta * 4.5, 1.0);

      gazeX += (targetCursorX - gazeX) * Math.min(delta * 9.5, 1.0);
      gazeY += (targetCursorY - gazeY) * Math.min(delta * 9.5, 1.0);

      // --- C. Periodic Natural Blinking ---
      nextBlinkTimer -= delta;
      const blinkFrequency = currentExpression === 'sleepy' ? 1.8 : 3.5;
      if (nextBlinkTimer <= 0 && !isBlinking) {
        isBlinking = true;
        blinkProgress = 0;
      }

      if (isBlinking) {
        const blinkSpeed = currentExpression === 'sleepy' ? 7.0 : 12.0;
        blinkProgress += delta * blinkSpeed;
        if (blinkProgress < Math.PI) {
          eyeBlinkScale = Math.max(0.06, 1.0 - Math.sin(blinkProgress) * 0.94);
        } else {
          isBlinking = false;
          eyeBlinkScale = 1.0;
          nextBlinkTimer = blinkFrequency + Math.random() * 2.5;
        }
      }

      // --- D. Apply Eye Tracking to Actual 3D Pupil Objects with Inverse Head Roll ---
      const headRoll = headGroup.rotation.z;
      const cosR = Math.cos(-headRoll);
      const sinR = Math.sin(-headRoll);
      const localGazeX = gazeX * cosR - gazeY * sinR;
      const localGazeY = gazeX * sinR + gazeY * cosR;

      const maxPupilX = 0.028 * currentEyeScaleX;
      const maxPupilY = 0.022 * currentEyeScaleY;

      leftEye.pupilGroup.position.x = localGazeX * maxPupilX;
      leftEye.pupilGroup.position.y = localGazeY * maxPupilY;
      rightEye.pupilGroup.position.x = localGazeX * maxPupilX;
      rightEye.pupilGroup.position.y = localGazeY * maxPupilY;

      const pupilTiltY = localGazeX * 0.24;
      const pupilTiltX = -localGazeY * 0.20;
      leftEye.pupilGroup.rotation.y = pupilTiltY;
      leftEye.pupilGroup.rotation.x = pupilTiltX;
      rightEye.pupilGroup.rotation.y = pupilTiltY;
      rightEye.pupilGroup.rotation.x = pupilTiltX;

      // Apply expression scale and vertical eyelid blink scale
      leftEye.socketGroup.scale.x = currentEyeScaleX;
      leftEye.socketGroup.scale.y = currentEyeScaleY * eyeBlinkScale;
      rightEye.socketGroup.scale.x = currentEyeScaleX;
      rightEye.socketGroup.scale.y = currentEyeScaleY * eyeBlinkScale;

      // --- E. Continuous Floating Animation ---
      const floatY = Math.sin(elapsedTime * 2.2) * (currentExpression === 'excited' ? 0.09 : 0.07);
      const floatRoll = Math.sin(elapsedTime * 1.5) * 0.022;
      const floatPitch = Math.cos(elapsedTime * 1.8) * 0.018;

      robotBody.position.y = floatY;
      robotBody.rotation.z = floatRoll;
      robotBody.rotation.x = floatPitch;

      // Rotate Base Platform Holograms
      innerHoloRing1.rotation.z -= delta * 0.2;
      innerHoloRing2.rotation.z += delta * 0.3;
      levitationBeam.material.opacity = 0.18 + Math.sin(elapsedTime * 2.8) * 0.05;

      // Tech Badges Orbit Animation & Facing
      badges.forEach((b, idx) => {
        const speed = 0.25;
        const currentAngle = b.angle + elapsedTime * speed;
        b.mesh.position.x = Math.cos(currentAngle) * b.r;
        b.mesh.position.z = Math.sin(currentAngle) * b.r;
        b.mesh.position.y = b.initialY + Math.sin(elapsedTime * 2.0 + idx) * 0.04;
        b.mesh.lookAt(camera.position);
      });

      // Floating Particle Drifting
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i] * delta * 0.3;
        if (positions[i * 3 + 1] > 0.8) {
          positions[i * 3 + 1] = -0.8;
        }
      }
      posAttr.needsUpdate = true;

      // Pulse Chest Energy Core
      const corePulse = 2.4 + Math.sin(elapsedTime * 3.5) * 0.5;
      chestPointLight.intensity = currentReaction === 'skills' ? 3.8 : corePulse;

      // --- F. Head Orientation with Expression Tilts ---
      let targetHeadYaw = currentCursorX * 0.25;
      let targetHeadPitch = -currentCursorY * 0.16 + targetHeadPitchAdd;
      let targetHeadRoll = currentCursorX * 0.06 + targetHeadRollAdd;

      let targetRightShoulderX = 0;
      let targetRightShoulderZ = -0.12;
      let targetRightForearmX = 0.42;
      let targetRightHandRotY = 0;
      let targetRightHandRotZ = 0;

      // Reaction Kinematics
      switch (currentReaction) {
        case 'projects':
          targetHeadYaw = 0.28;
          targetRightShoulderZ = -0.35;
          targetRightForearmX = 0.70;
          break;

        case 'skills':
          targetHeadPitch = 0.08;
          break;

        case 'about':
          targetHeadPitch += Math.sin(reactionTimer * 5.0) * 0.08;
          break;

        case 'resume':
          targetRightShoulderX = 0.65;
          targetRightShoulderZ = 0.25;
          targetRightForearmX = 0.18;
          targetRightHandRotZ = -0.25;
          break;

        case 'contact':
          targetRightShoulderX = 1.25;
          targetRightShoulderZ = 0.48;
          targetRightForearmX = 0.25;
          targetRightHandRotZ = Math.sin(reactionTimer * 8.0) * 0.38;
          targetRightHandRotY = 0.25;
          break;

        case 'idle':
        default:
          break;
      }

      // Smooth Head Joints Interpolation
      const headLerpSpeed = Math.min(delta * 5.5, 1.0);
      headGroup.rotation.y += (targetHeadYaw - headGroup.rotation.y) * headLerpSpeed;
      headGroup.rotation.x += (targetHeadPitch - headGroup.rotation.x) * headLerpSpeed;
      headGroup.rotation.z += (targetHeadRoll - headGroup.rotation.z) * headLerpSpeed;

      // Subtly rotate torso with body damping
      torsoGroup.rotation.y += (targetHeadYaw * 0.35 - torsoGroup.rotation.y) * headLerpSpeed;

      // --- G. Arm Kinematics & Natural Finger Flexing ---
      const armLerpSpeed = Math.min(delta * 6.0, 1.0);
      rightArm.shoulder.rotation.x +=
        (targetRightShoulderX - rightArm.shoulder.rotation.x) * armLerpSpeed;
      rightArm.shoulder.rotation.z +=
        (targetRightShoulderZ - rightArm.shoulder.rotation.z) * armLerpSpeed;
      rightArm.forearm.rotation.x +=
        (targetRightForearmX - rightArm.forearm.rotation.x) * armLerpSpeed;
      rightArm.hand.rotation.z +=
        (targetRightHandRotZ - rightArm.hand.rotation.z) * armLerpSpeed;
      rightArm.hand.rotation.y +=
        (targetRightHandRotY - rightArm.hand.rotation.y) * armLerpSpeed;

      // Left arm idle floating
      leftArm.shoulder.rotation.z = 0.14 + Math.sin(elapsedTime * 2.0) * 0.04;
      leftArm.shoulder.rotation.x = Math.sin(elapsedTime * 1.7) * 0.03;

      const idleFingerCurl = Math.sin(elapsedTime * 2.2) * 0.08;
      leftArm.fingers.forEach((f, idx) => {
        f.rotation.x = 0.28 + idleFingerCurl * (1 + idx * 0.15);
      });
      leftArm.thumb.rotation.x = 0.25 + idleFingerCurl * 0.5;

      if (currentReaction !== 'contact') {
        rightArm.fingers.forEach((f, idx) => {
          f.rotation.x = 0.28 + idleFingerCurl * (1 + idx * 0.15);
        });
        rightArm.thumb.rotation.x = 0.25 + idleFingerCurl * 0.5;
      } else {
        rightArm.fingers.forEach((f) => {
          f.rotation.x = 0.08;
        });
        rightArm.thumb.rotation.x = 0.12;
      }

      // Render Scene
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 10. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 11. Resource Disposal on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      unsubscribe();
      window.removeEventListener('active-section-change', handleActiveSection);
      heroArea.removeEventListener('click', handleSurpriseClick);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, [isSupported]);

  if (!isSupported) {
    return (
      <div className="flex h-[480px] w-full max-w-[460px] items-center justify-center rounded-2xl border border-cyan-500/20 bg-neutral-950/60 p-6 text-center font-mono text-xs text-neutral-400">
        <Bot className="h-8 w-8 text-cyan-400 mb-2 animate-bounce" />
        <p>AI Robot Companion ready in standby mode.</p>
      </div>
    );
  }

  return (
    <div className="relative group w-full max-w-[480px] flex flex-col items-center">
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className={`relative h-[480px] sm:h-[520px] lg:h-[560px] w-full pointer-events-none select-none ${className}`}
        aria-label="Interactive 3D Holographic AI Robot Companion"
      />
    </div>
  );
}
