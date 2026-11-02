import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Polyfill FileReader for Node.js GLTFExporter
if (!globalThis.FileReader) {
  globalThis.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.onload = null;
      this.onloadend = null;
      this.onerror = null;
    }
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }).catch(err => {
        if (this.onerror) this.onerror(err);
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        const base64 = Buffer.from(buf).toString('base64');
        this.result = `data:${blob.type || 'application/octet-stream'};base64,${base64}`;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }).catch(err => {
        if (this.onerror) this.onerror(err);
      });
    }
  };
}

export function buildAiRobotCompanion() {
  const root = new THREE.Group();
  root.name = 'AI_Robot_Companion_Root';

  // --- Materials ---
  const whiteShellMat = new THREE.MeshStandardMaterial({
    name: 'White_Lacquer_PBR',
    color: 0xf8fafc,
    roughness: 0.12,
    metalness: 0.18,
  });

  const silverMetalMat = new THREE.MeshStandardMaterial({
    name: 'Silver_Chrome_PBR',
    color: 0xcbd5e1,
    roughness: 0.20,
    metalness: 0.88,
  });

  const darkTitaniumMat = new THREE.MeshStandardMaterial({
    name: 'Dark_Titanium_PBR',
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.80,
  });

  const visorGlassMat = new THREE.MeshStandardMaterial({
    name: 'Visor_Gloss_Black',
    color: 0x050811,
    roughness: 0.05,
    metalness: 0.45,
  });

  const cyanGlowMat = new THREE.MeshStandardMaterial({
    name: 'Cyan_LED_Emission',
    color: 0x00f0ff,
    emissive: 0x36d9ff,
    emissiveIntensity: 2.2,
    roughness: 0.1,
  });

  const blueAccentMat = new THREE.MeshStandardMaterial({
    name: 'Royal_Blue_Accent',
    color: 0x2563ff,
    roughness: 0.25,
    metalness: 0.75,
  });

  const violetGlowMat = new THREE.MeshStandardMaterial({
    name: 'Violet_Energy_Emission',
    color: 0x713bff,
    emissive: 0x713bff,
    emissiveIntensity: 1.8,
    roughness: 0.2,
  });

  // ==========================================
  // 1. HOLOGRAPHIC ENVIRONMENT & PLATFORM
  // ==========================================
  const platformGroup = new THREE.Group();
  platformGroup.name = 'Holographic_Platform';
  platformGroup.position.set(0, -1.25, 0);
  root.add(platformGroup);

  // Outer floor bevel ring
  const baseRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.016, 16, 64),
    silverMetalMat
  );
  baseRing.rotation.x = Math.PI / 2;
  platformGroup.add(baseRing);

  // Inner holographic floor disc
  const holoFloorDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.74, 48),
    new THREE.MeshBasicMaterial({
      color: 0x36d9ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    })
  );
  holoFloorDisc.rotation.x = -Math.PI / 2;
  holoFloorDisc.position.y = 0.005;
  platformGroup.add(holoFloorDisc);

  // Concentric holographic rings
  const innerRing1 = new THREE.Mesh(new THREE.RingGeometry(0.48, 0.50, 48), cyanGlowMat);
  innerRing1.rotation.x = -Math.PI / 2;
  innerRing1.position.y = 0.01;
  platformGroup.add(innerRing1);

  const innerRing2 = new THREE.Mesh(new THREE.RingGeometry(0.24, 0.26, 48), cyanGlowMat);
  innerRing2.rotation.x = -Math.PI / 2;
  innerRing2.position.y = 0.012;
  platformGroup.add(innerRing2);

  // Orbital floating rings
  const orbitRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.008, 12, 64),
    cyanGlowMat
  );
  orbitRing1.name = 'Orbit_Ring_Alpha';
  orbitRing1.rotation.set(0.35, 0.2, 0);
  orbitRing1.position.set(0, 0.45, 0);
  platformGroup.add(orbitRing1);

  const orbitRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.74, 0.007, 12, 64),
    violetGlowMat
  );
  orbitRing2.name = 'Orbit_Ring_Beta';
  orbitRing2.rotation.set(-0.25, -0.4, 0.3);
  orbitRing2.position.set(0, 0.65, 0);
  platformGroup.add(orbitRing2);

  // ==========================================
  // 2. FLOATING ROBOT BODY ASSEMBLY
  // ==========================================
  const robotGroup = new THREE.Group();
  robotGroup.name = 'Robot_Body_Assembly';
  robotGroup.position.set(0, 0, 0);
  root.add(robotGroup);

  // --- A. Lower Body (Floating Thruster Pod - No conventional legs) ---
  const lowerBodyGroup = new THREE.Group();
  lowerBodyGroup.name = 'Lower_Body_Thruster_Pod';
  lowerBodyGroup.position.set(0, -0.32, 0);
  robotGroup.add(lowerBodyGroup);

  // Sleek tapered pod
  const podGeo = new THREE.CylinderGeometry(0.26, 0.12, 0.42, 32);
  const thrusterPod = new THREE.Mesh(podGeo, whiteShellMat);
  lowerBodyGroup.add(thrusterPod);

  // Pod bottom dome
  const podBottomCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    whiteShellMat
  );
  podBottomCap.rotation.x = Math.PI;
  podBottomCap.position.y = -0.21;
  lowerBodyGroup.add(podBottomCap);

  // Metallic trim bands
  const trimRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.262, 0.012, 16, 40),
    silverMetalMat
  );
  trimRing.rotation.x = Math.PI / 2;
  trimRing.position.y = 0.12;
  lowerBodyGroup.add(trimRing);

  const lowerTrimRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.010, 16, 40),
    darkTitaniumMat
  );
  lowerTrimRing.rotation.x = Math.PI / 2;
  lowerTrimRing.position.y = -0.10;
  lowerBodyGroup.add(lowerTrimRing);

  // Glowing Anti-Gravity Ion Emitter Cone
  const ionEmitter = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.18, 24),
    cyanGlowMat
  );
  ionEmitter.name = 'Ion_Repulsor_Emitter';
  ionEmitter.rotation.x = Math.PI;
  ionEmitter.position.y = -0.26;
  lowerBodyGroup.add(ionEmitter);

  // Ion glow ring
  const ionRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.11, 0.008, 12, 32),
    cyanGlowMat
  );
  ionRing.rotation.x = Math.PI / 2;
  ionRing.position.y = -0.28;
  lowerBodyGroup.add(ionRing);

  // --- B. Torso ---
  const torsoGroup = new THREE.Group();
  torsoGroup.name = 'Robot_Torso';
  torsoGroup.position.set(0, 0.06, 0);
  robotGroup.add(torsoGroup);

  // Main rounded torso shell
  const torsoGeo = new THREE.SphereGeometry(0.32, 32, 24);
  torsoGeo.scale(1.0, 1.15, 0.92);
  const torsoShell = new THREE.Mesh(torsoGeo, whiteShellMat);
  torsoGroup.add(torsoShell);

  // Side flank accent plates (left & right)
  const leftFlank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 0.28, 16),
    silverMetalMat
  );
  leftFlank.position.set(-0.25, 0, 0);
  leftFlank.rotation.z = 0.25;
  leftFlank.scale.set(0.6, 1.0, 0.8);
  torsoGroup.add(leftFlank);

  const rightFlank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 0.28, 16),
    silverMetalMat
  );
  rightFlank.position.set(0.25, 0, 0);
  rightFlank.rotation.z = -0.25;
  rightFlank.scale.set(0.6, 1.0, 0.8);
  torsoGroup.add(rightFlank);

  // Chest Energy Core Housing (Recessed bezel)
  const coreHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.095, 0.095, 0.04, 32),
    darkTitaniumMat
  );
  coreHousing.rotation.x = Math.PI / 2;
  coreHousing.position.set(0, 0.04, 0.27);
  torsoGroup.add(coreHousing);

  const coreBezel = new THREE.Mesh(
    new THREE.TorusGeometry(0.098, 0.012, 16, 36),
    silverMetalMat
  );
  coreBezel.position.set(0, 0.04, 0.28);
  torsoGroup.add(coreBezel);

  // Glowing Cyan Arc Energy Core
  const chestCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.068, 24, 20),
    cyanGlowMat
  );
  chestCore.name = 'Chest_Energy_Core';
  chestCore.position.set(0, 0.04, 0.275);
  torsoGroup.add(chestCore);

  // Concentric Core Ring
  const coreInnerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.042, 0.006, 12, 24),
    blueAccentMat
  );
  coreInnerRing.position.set(0, 0.04, 0.29);
  torsoGroup.add(coreInnerRing);

  // Neck Collar / Swivel Joint
  const neckJoint = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.17, 0.08, 24),
    silverMetalMat
  );
  neckJoint.position.set(0, 0.35, 0);
  torsoGroup.add(neckJoint);

  // --- C. Robot Head Assembly ---
  const headGroup = new THREE.Group();
  headGroup.name = 'Robot_Head';
  headGroup.position.set(0, 0.58, 0);
  robotGroup.add(headGroup);

  // Main white helmet dome (smooth organic sphere slightly widened)
  const helmetGeo = new THREE.SphereGeometry(0.36, 36, 30);
  helmetGeo.scale(1.10, 1.0, 1.05);
  const helmetMesh = new THREE.Mesh(helmetGeo, whiteShellMat);
  headGroup.add(helmetMesh);

  // Aerodynamic silver crown crest
  const crestGeo = new THREE.BoxGeometry(0.04, 0.06, 0.42);
  const crestMesh = new THREE.Mesh(crestGeo, silverMetalMat);
  crestMesh.position.set(0, 0.34, -0.05);
  headGroup.add(crestMesh);

  // Side Headphone-like Ear Modules (Left & Right)
  function buildEarModule(isRight) {
    const earGroup = new THREE.Group();
    const sign = isRight ? 1 : -1;
    earGroup.position.set(0.38 * sign, 0.02, 0.02);
    earGroup.rotation.y = sign * (Math.PI / 2);

    // Outer ear pod cylinder
    const pod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.12, 0.06, 32),
      silverMetalMat
    );
    pod.rotation.x = Math.PI / 2;
    earGroup.add(pod);

    // Glowing cyan concentric ring
    const earRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.085, 0.009, 14, 32),
      cyanGlowMat
    );
    earRing.position.z = 0.032;
    earGroup.add(earRing);

    // Center button jewel
    const earCenter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.048, 0.02, 24),
      blueAccentMat
    );
    earCenter.rotation.x = Math.PI / 2;
    earCenter.position.z = 0.035;
    earGroup.add(earCenter);

    return earGroup;
  }

  const leftEar = buildEarModule(false);
  const rightEar = buildEarModule(true);
  headGroup.add(leftEar);
  headGroup.add(rightEar);

  // Glossy Black Digital Face Visor
  const visorGeo = new THREE.SphereGeometry(0.33, 32, 24, 0, Math.PI, 0, Math.PI * 0.72);
  visorGeo.scale(1.05, 0.92, 0.94);
  const faceVisor = new THREE.Mesh(visorGeo, visorGlassMat);
  faceVisor.name = 'Face_Visor_Display';
  faceVisor.rotation.x = -0.15;
  faceVisor.position.set(0, -0.01, 0.09);
  headGroup.add(faceVisor);

  // Visor Framing Rim
  const visorBezel = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.012, 16, 40, Math.PI * 1.1),
    silverMetalMat
  );
  visorBezel.rotation.set(-0.25, 0, -Math.PI * 0.55);
  visorBezel.position.set(0, -0.01, 0.28);
  headGroup.add(visorBezel);

  // Two Large Glowing Electric Cyan LED Eyes with Pupils
  function buildLedEye(isRight) {
    const eyeGroup = new THREE.Group();
    const sign = isRight ? 1 : -1;
    eyeGroup.name = isRight ? 'Right_Eye_Assembly' : 'Left_Eye_Assembly';
    eyeGroup.position.set(0.118 * sign, 0.045, 0.355);

    // Socket backing & bezel
    const socketBacking = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.068, 0.012, 32),
      darkTitaniumMat
    );
    socketBacking.rotation.x = Math.PI / 2;
    eyeGroup.add(socketBacking);

    const socketRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.062, 0.0055, 14, 32),
      cyanGlowMat
    );
    socketRing.position.z = 0.006;
    eyeGroup.add(socketRing);

    // Outer cyan glowing iris capsule
    const irisCapsule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.010, 24),
      cyanGlowMat
    );
    irisCapsule.rotation.x = Math.PI / 2;
    irisCapsule.position.z = 0.008;
    eyeGroup.add(irisCapsule);

    // Inner bright pupil core
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 24, 20),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    pupil.scale.set(0.9, 1.25, 0.4);
    pupil.position.z = 0.014;
    eyeGroup.add(pupil);

    return eyeGroup;
  }

  const leftEye = buildLedEye(false);
  const rightEye = buildLedEye(true);
  headGroup.add(leftEye);
  headGroup.add(rightEye);

  // Expressive Animated Mouth (Small Glowing Cyan LED Arc)
  const mouthGeo = new THREE.TorusGeometry(0.036, 0.0045, 12, 24, Math.PI * 0.65);
  const mouthMesh = new THREE.Mesh(mouthGeo, cyanGlowMat);
  mouthMesh.name = 'Digital_Mouth';
  mouthMesh.rotation.set(0, 0, Math.PI * 0.175);
  mouthMesh.position.set(0, -0.095, 0.34);
  headGroup.add(mouthMesh);

  // --- D. Articulated Mechanical Arms & Improved Hand Anatomy ---
  function buildArm(isRight) {
    const armGroup = new THREE.Group();
    const sign = isRight ? 1 : -1;
    armGroup.name = isRight ? 'Right_Arm_Assembly' : 'Left_Arm_Assembly';
    armGroup.position.set(0.31 * sign, 0.10, 0.02);

    // Shoulder Chrome Ball Joint
    const shoulder = new THREE.Mesh(
      new THREE.SphereGeometry(0.066, 24, 20),
      silverMetalMat
    );
    shoulder.name = isRight ? 'Right_Shoulder' : 'Left_Shoulder';
    armGroup.add(shoulder);

    const shoulderCap = new THREE.Mesh(
      new THREE.TorusGeometry(0.068, 0.006, 12, 28),
      cyanGlowMat
    );
    shoulderCap.rotation.y = sign * (Math.PI / 2);
    shoulder.add(shoulderCap);

    // Upper arm
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

    // Elbow Hinge Disk
    const elbow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.042, 20),
      darkTitaniumMat
    );
    elbow.name = isRight ? 'Right_Elbow' : 'Left_Elbow';
    elbow.rotation.x = Math.PI / 2;
    elbow.position.set(0.052 * sign, -0.205, 0.02);
    shoulder.add(elbow);

    // Forearm capsule
    const forearm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.040, 0.15, 12, 16),
      whiteShellMat
    );
    forearm.position.set(0.075 * sign, -0.305, 0.08);
    forearm.rotation.x = 0.42;
    forearm.rotation.z = -0.12 * sign;
    shoulder.add(forearm);

    // Forearm cyan LED accent line
    const ledStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.008, 0.12, 0.014),
      cyanGlowMat
    );
    ledStripe.position.set(0.038 * sign, 0, 0.026);
    forearm.add(ledStripe);

    // Articulated Wrist Joint & Sensor Ring
    const wrist = new THREE.Group();
    wrist.name = isRight ? 'Right_Wrist' : 'Left_Wrist';
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

    // Rounded Robotic Palm & Distinguishable Fingers
    const handGroup = new THREE.Group();
    handGroup.name = isRight ? 'Right_Hand' : 'Left_Hand';
    handGroup.position.set(0, -0.025, 0);
    wrist.add(handGroup);

    // Rounded ceramic palm
    const palm = new THREE.Mesh(
      new THREE.SphereGeometry(0.034, 20, 16),
      whiteShellMat
    );
    palm.scale.set(1.0, 0.85, 0.65);
    handGroup.add(palm);

    // Back plate
    const handBackPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.025, 0.010, 16),
      silverMetalMat
    );
    handBackPlate.rotation.x = Math.PI / 2;
    handBackPlate.position.set(0, 0, -0.018);
    handGroup.add(handBackPlate);

    // Articulated Thumb
    const thumb = new THREE.Group();
    thumb.name = isRight ? 'Right_Thumb' : 'Left_Thumb';
    thumb.position.set(-0.022 * sign, 0.006, 0.008);
    thumb.rotation.set(0.25, 0.35 * sign, -0.45 * sign);
    handGroup.add(thumb);

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

    // 3 Articulated Fingers (Index, Middle, Ring/Pinky)
    const fingerOffsets = [
      { name: 'Index', x: -0.016 * sign, len: 0.024, rotZ: 0.08 * sign },
      { name: 'Middle', x: 0,            len: 0.028, rotZ: 0 },
      { name: 'Pinky', x: 0.016 * sign,  len: 0.022, rotZ: -0.08 * sign },
    ];

    fingerOffsets.forEach((fo) => {
      const fingerGroup = new THREE.Group();
      fingerGroup.name = `${isRight ? 'Right' : 'Left'}_Finger_${fo.name}`;
      fingerGroup.position.set(fo.x, -0.024, 0.002);
      fingerGroup.rotation.z = fo.rotZ;
      fingerGroup.rotation.x = 0.28;
      handGroup.add(fingerGroup);

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
    });

    return armGroup;
  }

  const leftArm = buildArm(false);
  const rightArm = buildArm(true);
  robotGroup.add(leftArm);
  robotGroup.add(rightArm);

  return root;
}

// Export to GLB
async function exportGlb() {
  const robotRoot = buildAiRobotCompanion();
  const scene = new THREE.Scene();
  scene.add(robotRoot);

  const exporter = new GLTFExporter();
  const options = {
    binary: true,
    truncateDrawRange: false,
    embedImages: true,
  };

  const outputDir = path.resolve('apps/web/public/models');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'ai-robot-companion.glb');

  exporter.parse(
    scene,
    (glbBuffer) => {
      const buffer = Buffer.from(glbBuffer);
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ AI Robot Companion GLB exported successfully to: ${outputPath} (${buffer.length} bytes)`);
    },
    (err) => {
      console.error('❌ Failed to export GLB:', err);
      process.exit(1);
    },
    options
  );
}

exportGlb();

