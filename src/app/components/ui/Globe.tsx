"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3,  } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "../../../../data/globe.json";

// Extend JSX intrinsic element to support <threeGlobe />
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: JSX.IntrinsicElements["mesh"] & {
      ref?: React.Ref<ThreeGlobe>;
    };
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings: number[] = [0];

export function Globe({ globeConfig, data }: WorldProps) {
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
      }[]
    | null
  >(null);

const globeRef = useRef(new ThreeGlobe());


  const fallbackGlobeConfig: GlobeConfig = {};
  const config = { ...fallbackGlobeConfig, ...globeConfig };

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...config,
  };

  const _buildMaterial = useCallback(() => {
    if (!globeRef.current) return;
    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;
  }, [defaultProps]);

  const _buildData = useCallback(() => {
    const arcs = data;
    const points: typeof globeData = [];

    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex(
          (v2) =>
            ["lat", "lng"].every(
              (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
            )
        ) === i
    );

    setGlobeData(filteredPoints);
  }, [data, defaultProps.pointSize]);

  useEffect(() => {
    if (globeRef.current) {
      _buildData();
      _buildMaterial();
    }
  }, [_buildData, _buildMaterial]);

  useEffect(() => {
    if (globeRef.current && globeData) {
      globeRef.current
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => defaultProps.polygonColor);
      startAnimation();
    }
  }, [globeData, defaultProps]);

 const startAnimation = useCallback(() => {
  if (!globeRef.current || !globeData) return;

  globeRef.current
    .arcsData(data as Position[])   .arcStartLat((d: unknown) => (d as Position).startLat)
      .arcStartLng((d: unknown) => (d as Position).startLng)
      .arcEndLat((d: unknown) => (d as Position).endLat)
      .arcEndLng((d: unknown) => (d as Position).endLng)
      .arcColor((d: unknown) => (d as Position).color)
      .arcAltitude((d: unknown) => (d as Position).arcAlt)
    .arcAltitude((d) => (d as Position).arcAlt)
    .arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
    .arcDashLength(defaultProps.arcLength)
    .arcDashInitialGap((d) => (d as Position).order)
    .arcDashGap(15)
    .arcDashAnimateTime(() => defaultProps.arcTime);

  globeRef.current
    .pointsData(data as Position[])
    .pointColor((d) => (d as Position).color)
    .pointsMerge(true)
    .pointAltitude(0.0)
    .pointRadius(2);

  globeRef.current
    .ringsData([])
 .ringColor((d: unknown) => (t: number) => (d as { color: (t: number) => string }).color(t))
    .ringMaxRadius(defaultProps.maxRings)
    .ringPropagationSpeed(RING_PROPAGATION_SPEED)
    .ringRepeatPeriod(
      (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
    );
}, [globeData, data, defaultProps]);


useEffect(() => {
  if (globeRef.current && globeData) {
    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    startAnimation(); // now safe
  }
}, [globeData, defaultProps, startAnimation]);


     useEffect(() => {
    if (!globeRef.current || !globeData) return;

    const interval = setInterval(() => {
      numbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5)
      );

      globeRef.current!.ringsData(
        globeData.filter((_, i) => numbersOfRings.includes(i))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [globeData, data.length]);

  
  return <primitive object={globeRef.current} />;
};



export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, size.width, size.height]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}
