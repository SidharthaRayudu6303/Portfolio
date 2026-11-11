'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Animated Aurora Waves
 *
 * Cinematic, elegant northern lights / illuminated silk waves flowing across
 * the portfolio background with electric-blue, cyan, and subtle violet highlights.
 *
 * Features:
 * - Pure GLSL multi-layered wave physics with organic vertical ray striations
 * - Interactive cursor-following silk fluid displacement
 * - Continuous smooth multi-octave horizontal and diagonal drifting
 * - Soft cyan ambient backlighting behind the 3D robot companion
 * - Optimal text-contrast attenuation on the left column
 * - Seamless scroll parallax across portfolio sections
 * - 60fps low-power GPU rendering with mobile & reduced-motion support
 */
export function ParticleUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Safe WebGL Support Check
    let isWebGLAvailable = false;
    try {
      const testCanvas = document.createElement('canvas');
      const testGl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      isWebGLAvailable = Boolean(testGl);
    } catch {
      isWebGLAvailable = false;
    }
    if (!isWebGLAvailable) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // 2. Scene, Orthographic Camera, and WebGLRenderer
    const aspect = window.innerWidth / window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0, 10);
    camera.position.z = 2;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    } catch {
      return;
    }

    // 3. GLSL Shaders for Animated Aurora Waves (Atmospheric Silk Foundation)
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.x, position.y, 0.999, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uScroll;
      uniform float uReducedMotion;

      varying vec2 vUv;

      // Color Palette Constants
      const vec3 COLOR_VOID_BASE   = vec3(0.020, 0.035, 0.075); // #050913 deep cosmic navy
      const vec3 COLOR_DEEP_BLUE   = vec3(0.060, 0.180, 0.520); // #0f2e85 deep royal blue
      const vec3 COLOR_ELECTRIC    = vec3(0.110, 0.420, 0.980); // #1c6bfa electric blue
      const vec3 COLOR_CYAN_LIGHT  = vec3(0.000, 0.880, 1.000); // #00e0ff electric cyan
      const vec3 COLOR_AQUA_ICE    = vec3(0.350, 0.940, 1.000); // #59f0ff soft aqua core
      const vec3 COLOR_ROYAL_PURP  = vec3(0.480, 0.220, 0.850); // #7b38d9 royal purple
      const vec3 COLOR_VIOLET_MIST = vec3(0.360, 0.140, 0.650); // #5c24a6 subtle violet highlight

      float waveLayer1(float x, float t) {
        return 0.13 * sin(x * 1.6 + t * 0.32)
             + 0.08 * sin(x * 3.2 - t * 0.22 + 1.4)
             + 0.04 * cos(x * 5.4 + t * 0.40);
      }

      float waveLayer2(float x, float t) {
        return 0.16 * sin(x * 1.1 - t * 0.20 + 2.6)
             + 0.09 * cos(x * 2.6 + t * 0.16 + 0.8)
             + 0.05 * sin(x * 4.4 - t * 0.26);
      }

      float waveLayer3(float x, float t) {
        return 0.10 * cos(x * 2.1 + t * 0.26 + 3.8)
             + 0.06 * sin(x * 3.8 - t * 0.18 + 2.2)
             + 0.03 * cos(x * 6.8 + t * 0.32);
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
        float t = uTime * (uReducedMotion > 0.5 ? 0.15 : 0.75);

        // Mouse Fluid Displacement
        vec2 mouseP = (uMouse - 0.5) * vec2(aspect, 1.0);
        vec2 toMouse = p - mouseP;
        float mouseDist = length(toMouse);
        vec2 mouseWarp = (toMouse / (mouseDist * mouseDist + 0.12)) * 0.028;
        p += mouseWarp;

        // Scroll Parallax
        float scrollOffset = uScroll * 0.32;
        p.y += scrollOffset;

        // Layer 1
        float yCenter1 = 0.08 + sin(t * 0.22) * 0.05;
        float dist1 = p.y - waveLayer1(p.x, t) - yCenter1;
        float lowerFalloff1 = exp(dist1 * 14.0);
        float upperFalloff1 = exp(-dist1 * 4.2);
        float verticalRays1 = 0.85 + 0.15 * sin(p.x * 38.0 + t * 0.75 + sin(p.y * 18.0));
        float intensity1 = clamp((dist1 < 0.0 ? lowerFalloff1 : upperFalloff1) * verticalRays1, 0.0, 1.0);
        vec3 colLayer1 = mix(COLOR_CYAN_LIGHT, COLOR_AQUA_ICE, clamp(intensity1 * 1.3 - 0.3, 0.0, 1.0)) * intensity1;

        // Layer 2
        float yCenter2 = -0.15 + cos(t * 0.18) * 0.06;
        float dist2 = p.y - waveLayer2(p.x, t) - yCenter2;
        float lowerFalloff2 = exp(dist2 * 10.0);
        float upperFalloff2 = exp(-dist2 * 3.2);
        float verticalRays2 = 0.90 + 0.10 * cos(p.x * 24.0 - t * 0.55);
        float intensity2 = clamp((dist2 < 0.0 ? lowerFalloff2 : upperFalloff2) * verticalRays2, 0.0, 1.0);
        vec3 colLayer2 = mix(COLOR_DEEP_BLUE, COLOR_ELECTRIC, intensity2) * intensity2;

        // Layer 3
        float yCenter3 = 0.24 + sin(t * 0.28 + 1.2) * 0.04;
        float dist3 = p.y - waveLayer3(p.x, t) - yCenter3;
        float lowerFalloff3 = exp(dist3 * 16.0);
        float upperFalloff3 = exp(-dist3 * 5.0);
        float intensity3 = clamp((dist3 < 0.0 ? lowerFalloff3 : upperFalloff3), 0.0, 1.0);
        vec3 colLayer3 = mix(COLOR_VIOLET_MIST, COLOR_ROYAL_PURP, intensity3) * (intensity3 * 0.65);

        // Robot Halo Glow
        vec2 robotHeroPos = vec2(0.50 * aspect, 0.08);
        float distToRobot = length(p - robotHeroPos);
        float robotHalo = exp(-distToRobot * 2.2) * 0.28;
        vec3 colRobotHalo = mix(COLOR_CYAN_LIGHT, COLOR_ROYAL_PURP, 0.35) * robotHalo;

        vec3 finalColor = COLOR_VOID_BASE;
        finalColor += colLayer2 * 0.55;
        finalColor += colLayer1 * 0.48;
        finalColor += colLayer3 * 0.35;
        finalColor += colRobotHalo;

        float textShield = smoothstep(-0.8 * aspect, 0.3 * aspect, p.x);
        finalColor *= mix(0.70, 1.0, textShield);

        float vignette = 1.0 - smoothstep(0.4, 1.4, length((uv - 0.5) * vec2(1.2, 1.0)));
        finalColor *= mix(0.85, 1.0, vignette);

        gl_FragColor = vec4(finalColor, 0.85);
      }
    `;

    // 4. Uniforms and ShaderMaterial for Background Waves
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uReducedMotion: { value: prefersReducedMotion ? 1.0 : 0.0 },
    };

    const auroraMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    let auroraGeometry = new THREE.PlaneGeometry(aspect * 2.2, 2.2);
    const auroraMesh = new THREE.Mesh(auroraGeometry, auroraMaterial);
    auroraMesh.position.set(0, 0, 0);
    auroraMesh.renderOrder = 0;
    scene.add(auroraMesh);

    // 5. Cursor Tracking with Smooth Lerp
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0.5;
      targetMouseY = 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // 6. Scroll Parallax Tracking
    let targetScroll = 0;
    let currentScroll = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = Math.min(1.0, Math.max(0.0, window.scrollY / maxScroll));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 7. Kinetic 60fps Animation Loop (Dedicated solely to Aurora Waves)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Smooth cursor lerping
      currentMouseX += (targetMouseX - currentMouseX) * Math.min(delta * 4.0, 1.0);
      currentMouseY += (targetMouseY - currentMouseY) * Math.min(delta * 4.0, 1.0);

      // Smooth scroll lerping
      currentScroll += (targetScroll - currentScroll) * Math.min(delta * 5.0, 1.0);

      // Update shader uniforms for Aurora Waves
      uniforms.uTime.value = elapsedTime;
      uniforms.uMouse.value.set(currentMouseX, currentMouseY);
      uniforms.uScroll.value = currentScroll;

      renderer?.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 8. Responsive Resize Handler
    const handleResize = () => {
      if (!renderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const newAspect = w / h;

      camera.left = -newAspect;
      camera.right = newAspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);

      auroraGeometry.dispose();
      auroraGeometry = new THREE.PlaneGeometry(newAspect * 2.2, 2.2);
      auroraMesh.geometry = auroraGeometry;
    };

    window.addEventListener('resize', handleResize);

    // 9. Clean up all resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      auroraGeometry.dispose();
      auroraMaterial.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 h-full w-full"
      style={{ opacity: 0.90 }}
      aria-hidden="true"
    />
  );
}

// Alias export for semantic clarity
export const AuroraWaves = ParticleUniverse;
