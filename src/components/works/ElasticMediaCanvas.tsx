"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

type MediaMeasure = {
  id: string;
  src: string;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
  radius: number;
  docLeft: number;
  docTop: number;
  variation: number;
};

type ScrollState = {
  target: number;
  current: number;
  previous: number;
  velocity: number;
  shaderVelocity: number;
  direction: number;
  energy: number;
  time: number;
  hoverId: string | null;
  activeId: string | null;
};

const CONFIG = {
  curveDepth: 74,
  curveAngle: 0.072,
  bendStrength: 0.015,
  stretchStrength: 0.026,
  depthStrength: 22,
  shearStrength: 0.018,
  velocityMultiplier: 0.00042,
  velocityClamp: 0.76,
  scrollLerp: 34,
  deformationDamping: 14,
  defaultRadius: 7,
  visibilityPadding: 520,
};

const vertexShader = `
  uniform float uVelocity;
  uniform float uHover;
  uniform float uCurveStrength;
  uniform float uBendStrength;
  uniform float uStretchStrength;
  uniform float uDepthStrength;
  uniform float uShearStrength;
  uniform float uVariation;
  uniform float uTime;
  varying vec2 vUv;
  varying float vEnergy;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float signedVelocity = clamp(uVelocity, -1.0, 1.0);
    float velocityAmount = abs(signedVelocity);
    float verticalProfile = sin(uv.y * 3.14159265);
    float horizontalProfile = (uv.x - 0.5) * 2.0;
    float diagonalProfile = sin((uv.x * 1.55 + uv.y * 0.92 + uVariation * 0.17) * 3.14159265);
    float ribbonProfile = sin((uv.y + uVariation * 0.025 + uTime * 0.012) * 6.2831853) * 0.08;
    float elasticProfile = verticalProfile + ribbonProfile;

    pos.x += signedVelocity * uBendStrength * elasticProfile * (1.0 + abs(horizontalProfile) * 0.28);
    pos.x += signedVelocity * uShearStrength * (uv.y - 0.5);
    pos.y *= 1.0 + velocityAmount * uStretchStrength * (0.55 + verticalProfile * 0.45);
    pos.y += signedVelocity * uStretchStrength * 0.18 * diagonalProfile;
    pos.z += velocityAmount * uDepthStrength * verticalProfile;
    pos.z += signedVelocity * uDepthStrength * 0.18 * horizontalProfile * verticalProfile;
    pos.z += velocityAmount * uDepthStrength * 0.18 * diagonalProfile;
    pos.z += uHover * 16.0;
    vEnergy = velocityAmount;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uImageResolution;
  uniform vec2 uPlaneResolution;
  uniform float uVelocity;
  uniform float uHover;
  uniform float uOpacity;
  uniform float uRadius;
  uniform float uTime;
  varying vec2 vUv;
  varying float vEnergy;

  vec2 coverUv(vec2 uv, vec2 image, vec2 plane) {
    float imageAspect = image.x / image.y;
    float planeAspect = plane.x / plane.y;
    vec2 cover = uv;
    if (planeAspect > imageAspect) {
      cover.y = (uv.y - 0.5) * (planeAspect / imageAspect) + 0.5;
    } else {
      cover.x = (uv.x - 0.5) * (imageAspect / planeAspect) + 0.5;
    }
    return cover;
  }

  float roundedRectMask(vec2 uv, vec2 size, float radius) {
    vec2 pixel = uv * size;
    vec2 halfSize = size * 0.5;
    vec2 distanceToEdge = abs(pixel - halfSize) - (halfSize - vec2(radius));
    float signedDistance = length(max(distanceToEdge, 0.0)) + min(max(distanceToEdge.x, distanceToEdge.y), 0.0);
    return 1.0 - smoothstep(0.0, 1.4, signedDistance);
  }

  void main() {
    vec2 uv = coverUv(vUv, uImageResolution, uPlaneResolution);
    float roundedMask = roundedRectMask(vUv, uPlaneResolution, uRadius);
    if (roundedMask < 0.01) discard;
    float signedVelocity = clamp(uVelocity, -1.0, 1.0);
    float ripple = sin((vUv.y * 2.0 + vUv.x * 0.72 + uTime * 0.018) * 6.2831853);
    vec2 warpedUv = uv;
    warpedUv.x += signedVelocity * (vUv.y - 0.5) * 0.015;
    warpedUv.y += abs(signedVelocity) * ripple * 0.0028;
    vec4 color = texture2D(uTexture, warpedUv);
    vec4 colorShift = texture2D(uTexture, warpedUv + vec2(signedVelocity * 0.0045, 0.0));
    color.r = mix(color.r, colorShift.r, min(vEnergy * 0.34, 0.22));
    color.rgb = mix(color.rgb, color.rgb * vec3(1.018, 1.032, 1.055), uHover * 0.16);
    color.rgb = mix(color.rgb, color.rgb * vec3(0.988, 0.996, 1.018), min(vEnergy * 0.12, 0.08));
    gl_FragColor = vec4(color.rgb, color.a * uOpacity * roundedMask);
  }
`;

const gridVertexShader = `
  uniform vec2 uViewport;
  uniform float uCurveDepth;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float normalizedX = pos.x / max(1.0, uViewport.x * 0.5);
    pos.z -= uCurveDepth * normalizedX * normalizedX;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const gridFragmentShader = `
  uniform float uOpacity;
  varying vec2 vUv;

  float lineMask(float value) {
    float grid = abs(fract(value) - 0.5);
    return 1.0 - smoothstep(0.485, 0.5, grid);
  }

  void main() {
    vec2 gridUv = vUv * vec2(18.0, 10.0);
    float line = max(lineMask(gridUv.x), lineMask(gridUv.y));
    vec3 color = mix(vec3(0.03, 0.11, 0.29), vec3(0.12, 0.39, 0.96), 0.45);
    gl_FragColor = vec4(color, line * uOpacity);
  }
`;

function useMeasuredMedia() {
  const [items, setItems] = useState<MediaMeasure[]>([]);

  useEffect(() => {
    let frame = 0;
    let disposed = false;

    const measure = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed) return;
        const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-elastic-media]"));
        nodes.forEach((node) => resizeObserver.observe(node));
        setItems(
          nodes.map((node, index) => {
            const rect = node.getBoundingClientRect();
            const radius = Number.parseFloat(getComputedStyle(node).borderTopLeftRadius);
            const cssRadius = Number.isFinite(radius) && radius > 0 ? radius : CONFIG.defaultRadius;
            const measuredRadius = THREE.MathUtils.clamp(cssRadius, 6, 10);
            return {
              id: node.dataset.mediaId ?? `media-${index}`,
              src: node.dataset.mediaSrc ?? "",
              width: rect.width,
              height: rect.height,
              imageWidth: Number(node.dataset.imageWidth ?? rect.width),
              imageHeight: Number(node.dataset.imageHeight ?? rect.height),
              radius: measuredRadius,
              docLeft: rect.left + window.scrollX,
              docTop: rect.top + window.scrollY,
              variation: 0.98 + (index % 5) * 0.012,
            };
          }).filter((item) => item.src && item.width > 2 && item.height > 2),
        );
      });
    };

    const resizeObserver = new ResizeObserver(measure);
    const mutationObserver = new MutationObserver(measure);

    measure();
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("orientationchange", measure, { passive: true });
    window.addEventListener("load", measure, { passive: true });
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  return items;
}

function MediaPlane({ item, scroll }: { item: MediaMeasure; scroll: MutableRefObject<ScrollState> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, item.src);
  const { size } = useThree();

  const geometryArgs = useMemo<[number, number, number, number]>(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 760;
    const subdivisions = mobile ? 14 : 24;
    return [1, 1, subdivisions, subdivisions];
  }, []);

  const material = useMemo(() => {
    const shader = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uImageResolution: { value: new THREE.Vector2(item.imageWidth, item.imageHeight) },
        uPlaneResolution: { value: new THREE.Vector2(item.width, item.height) },
        uVelocity: { value: 0 },
        uHover: { value: 0 },
        uOpacity: { value: 1 },
        uRadius: { value: item.radius },
        uCurveStrength: { value: CONFIG.curveDepth },
        uBendStrength: { value: CONFIG.bendStrength },
        uStretchStrength: { value: CONFIG.stretchStrength },
        uDepthStrength: { value: CONFIG.depthStrength },
        uShearStrength: { value: CONFIG.shearStrength },
        uVariation: { value: item.variation },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      alphaTest: 0.01,
      depthWrite: false,
    });
    return shader;
  }, [item.height, item.imageHeight, item.imageWidth, item.radius, item.variation, item.width, texture]);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 2;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    material.uniforms.uTexture.value = texture;
    return () => material.dispose();
  }, [material, texture]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const state = scroll.current;
    const top = item.docTop - state.current;
    const x = item.docLeft + item.width / 2 - size.width / 2;
    const y = size.height / 2 - top - item.height / 2;
    const normalizedX = THREE.MathUtils.clamp(x / Math.max(1, size.width / 2), -1.25, 1.25);
    const curveZ = -CONFIG.curveDepth * normalizedX * normalizedX;
    const hoverTarget = state.hoverId === item.id ? 1 : 0;
    const activeTarget = state.activeId === item.id ? 1 : 0;
    const hover = Math.max(hoverTarget, activeTarget);
    const hoverValue = THREE.MathUtils.damp(material.uniforms.uHover.value as number, hover, 14, delta);
    const hiddenByActiveProject = state.activeId && state.activeId !== item.id;

    const visible = top > -item.height - CONFIG.visibilityPadding && top < size.height + item.height + CONFIG.visibilityPadding;
    mesh.visible = visible;
    if (!visible) return;

    mesh.position.set(x, y, curveZ + hoverValue * 34);
    mesh.rotation.y = normalizedX * CONFIG.curveAngle * (1 - hoverValue * 0.46) + state.shaderVelocity * 0.018;
    mesh.rotation.x = -state.shaderVelocity * 0.014;
    mesh.rotation.z = state.shaderVelocity * 0.004;
    mesh.scale.set(item.width * (1 + hoverValue * 0.014), item.height * (1 + Math.abs(state.shaderVelocity) * 0.012 + hoverValue * 0.01), 1);

    material.uniforms.uVelocity.value = state.shaderVelocity;
    material.uniforms.uHover.value = hoverValue;
    material.uniforms.uOpacity.value = THREE.MathUtils.damp(material.uniforms.uOpacity.value as number, hiddenByActiveProject ? 0.16 : 1, 12, delta);
    material.uniforms.uRadius.value = Math.min(item.radius, item.width * 0.5, item.height * 0.5);
    material.uniforms.uTime.value = state.time;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={geometryArgs} />
    </mesh>
  );
}

function CurvedGrid({ scroll }: { scroll: MutableRefObject<ScrollState> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uViewport: { value: new THREE.Vector2(1, 1) },
          uCurveDepth: { value: CONFIG.curveDepth },
          uOpacity: { value: 0.13 },
        },
        vertexShader: gridVertexShader,
        fragmentShader: gridFragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    material.uniforms.uViewport.value.set(size.width, size.height);
    material.uniforms.uOpacity.value = THREE.MathUtils.damp(material.uniforms.uOpacity.value as number, 0.13 + Math.abs(scroll.current.shaderVelocity) * 0.045, 8, delta);
    meshRef.current.scale.set(size.width * 1.55, size.height * 1.35, 1);
    meshRef.current.position.z = -160;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[1, 1, 48, 16]} />
    </mesh>
  );
}

function Scene({ items }: { items: MediaMeasure[] }) {
  const scroll = useRef<ScrollState>({
    target: 0,
    current: 0,
    previous: 0,
    velocity: 0,
    shaderVelocity: 0,
    direction: 1,
    energy: 0,
    time: 0,
    hoverId: null,
    activeId: null,
  });
  const readyRef = useRef(false);
  const readyFrameCountRef = useRef(0);
  const { gl } = useThree();
  const itemSignature = useMemo(() => items.map((item) => `${item.id}:${item.src}`).join("|"), [items]);

  const report = useMemo(
    () => (ready: boolean) => {
      window.dispatchEvent(new CustomEvent("works-media-canvas-health", { detail: ready }));
    },
    [],
  );

  useEffect(() => {
    const update = () => {
      scroll.current.target = window.scrollY;
    };
    const hover = (event: Event) => {
      scroll.current.hoverId = (event as CustomEvent<string | null>).detail;
    };
    const active = (event: Event) => {
      scroll.current.activeId = (event as CustomEvent<string | null>).detail;
    };

    const initialY = window.scrollY;
    scroll.current.target = initialY;
    scroll.current.current = initialY;
    scroll.current.previous = initialY;
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("works-media-hover", hover);
    window.addEventListener("works-media-active", active);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("works-media-hover", hover);
      window.removeEventListener("works-media-active", active);
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;
    const onContextLost = () => {
      readyRef.current = false;
      readyFrameCountRef.current = 0;
      report(false);
    };
    const onContextRestored = () => {
      readyRef.current = false;
      readyFrameCountRef.current = 0;
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
    };
  }, [gl, report]);

  useEffect(() => {
    readyRef.current = false;
    readyFrameCountRef.current = 0;
    report(false);
  }, [itemSignature, report]);

  useFrame((_, delta) => {
    const state = scroll.current;
    const context = gl.getContext();

    const hasMeasuredMedia = items.length > 0;
    const rendererReady = context.drawingBufferWidth > 0 && context.drawingBufferHeight > 0;

    if (!readyRef.current && hasMeasuredMedia && rendererReady) {
      readyFrameCountRef.current += 1;
    } else if (!hasMeasuredMedia || !rendererReady) {
      readyFrameCountRef.current = 0;
    }

    if (!readyRef.current && readyFrameCountRef.current >= 4) {
      readyRef.current = true;
      report(true);
    }

    const frameDelta = Math.min(delta, 0.05);
    state.target = window.scrollY;
    state.current = THREE.MathUtils.damp(state.current, state.target, CONFIG.scrollLerp, frameDelta);
    if (Math.abs(state.current - state.target) < 0.035) {
      state.current = state.target;
    }
    state.velocity = (state.current - state.previous) / Math.max(frameDelta, 1 / 120);
    state.direction = state.velocity === 0 ? state.direction : Math.sign(state.velocity);
    const normalized = THREE.MathUtils.clamp(state.velocity * CONFIG.velocityMultiplier, -CONFIG.velocityClamp, CONFIG.velocityClamp);
    const velocityTarget = Math.sign(normalized) * Math.pow(Math.abs(normalized), 0.82);
    state.shaderVelocity = THREE.MathUtils.damp(state.shaderVelocity, velocityTarget, CONFIG.deformationDamping, frameDelta);
    state.energy = THREE.MathUtils.damp(state.energy, Math.abs(velocityTarget), 10, frameDelta);
    state.time += frameDelta * (0.8 + state.energy * 3.2);
    state.previous = state.current;
  });

  return (
    <>
      <CurvedGrid scroll={scroll} />
      <Suspense fallback={null}>
        {items.map((item) => <MediaPlane key={item.id} item={item} scroll={scroll} />)}
      </Suspense>
    </>
  );
}

export default function ElasticMediaCanvas() {
  const items = useMeasuredMedia();

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 600], zoom: 1, near: 0.1, far: 1200 }}
      dpr={[1, 1.25]}
      gl={{ alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        window.dispatchEvent(new CustomEvent("works-media-canvas-health", { detail: false }));
      }}
    >
      <Scene items={items} />
    </Canvas>
  );
}
