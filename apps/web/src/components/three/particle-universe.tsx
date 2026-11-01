'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ParticleUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL availability
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    } catch {
      return;
    }
    if (!gl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false, // Turn off antialiasing for maximum background particle performance
        powerPreference: 'low-power',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } catch {
      return;
    }

    // 2. Generate 1,800 Balanced GPU Particles
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    // Color palette: Electric Cyan, Sapphire Blue, Deep Violet
    const cyan = new THREE.Color(0x00f0ff);
    const blue = new THREE.Color(0x2563eb);
    const indigo = new THREE.Color(0x6366f1);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Distribute in 3D volume
      const x = (Math.random() - 0.5) * 110;
      const y = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 60;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      // Color variation across depth
      const colorRatio = Math.random();
      const mixedColor = new THREE.Color();
      if (colorRatio < 0.45) {
        mixedColor.copy(cyan).lerp(blue, Math.random() * 0.5);
      } else if (colorRatio < 0.8) {
        mixedColor.copy(blue).lerp(indigo, Math.random() * 0.6);
      } else {
        mixedColor.copy(cyan);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Varied particle sizes
      scales[i] = 1.0 + Math.random() * 2.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular soft glow texture generated programmatically (zero network download)
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 32;
    textureCanvas.height = 32;
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(0, 240, 255, 0.7)');
      gradient.addColorStop(0.7, 'rgba(37, 99, 235, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(textureCanvas);

    const material = new THREE.PointsMaterial({
      size: 1.8,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Mouse Interaction Tracking (World Coordinates)
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      worldX: 0,
      worldY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Convert screen coordinates to normalized device coordinates (-1 to 1)
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Project into world space at z = 0
      mouse.worldX = mouse.targetX * 55;
      mouse.worldY = mouse.targetY * 35;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 4. Animation Loop with Subtle Undulating Wave + Cursor Repulsion
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return; // Pause rendering if tab is hidden

      const elapsedTime = clock.getElapsedTime();
      const speedMultiplier = prefersReducedMotion ? 0.15 : 1.0;

      // Smooth mouse lerp
      mouse.x += (mouse.worldX - mouse.x) * 0.05;
      mouse.y += (mouse.worldY - mouse.y) * 0.05;

      const posAttr = geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      // Slow overall galaxy rotation
      particles.rotation.y = elapsedTime * 0.02 * speedMultiplier;
      particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05 * speedMultiplier;

      // Wave and mouse influence calculation
      if (!prefersReducedMotion) {
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const bx = basePositions[i3];
          const by = basePositions[i3 + 1];
          const bz = basePositions[i3 + 2];

          // Harmonic wave motion
          const waveX = Math.sin(elapsedTime * 0.6 + by * 0.1) * 0.4;
          const waveY = Math.cos(elapsedTime * 0.5 + bx * 0.1) * 0.4;
          const waveZ = Math.sin(elapsedTime * 0.4 + (bx + by) * 0.05) * 0.6;

          let targetX = bx + waveX;
          let targetY = by + waveY;
          let targetZ = bz + waveZ;

          // Distance to cursor in 2D projection
          const dx = targetX - mouse.x;
          const dy = targetY - mouse.y;
          const distSq = dx * dx + dy * dy;
          const repulsionRadiusSq = 144; // 12 units radius

          if (distSq < repulsionRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 12) * 5.0; // gentle repulsion push
            targetX += (dx / dist) * force;
            targetY += (dy / dist) * force;
            targetZ += force * 1.5; // push slightly towards camera
          }

          // Damped spring interpolation back to target
          posArray[i3] += (targetX - posArray[i3]) * 0.1;
          posArray[i3 + 1] += (targetY - posArray[i3 + 1]) * 0.1;
          posArray[i3 + 2] += (targetZ - posArray[i3 + 2]) * 0.1;
        }

        posAttr.needsUpdate = true;
      }

      renderer?.render(scene, camera);
    };

    animate();

    // 5. Responsive Resize
    const handleResize = () => {
      if (!renderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 6. Cleanup & Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 h-full w-full opacity-60"
      aria-hidden="true"
    />
  );
}

