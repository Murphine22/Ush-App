import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleBackgroundProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  className?: string;
}

const ParticleSystem = ({ count = 5000, color = "#3B82F6", size = 0.002, speed = 0.5 }) => {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      const colorObj = new THREE.Color(color);
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }
    
    return [positions, colors];
  }, [count, color]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.1) * 0.1;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.15) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  count = 3000, 
  color = "#3B82F6", 
  size = 0.002, 
  speed = 0.5,
  className = ""
}) => {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        performance={{ min: 0.5 }}
        dpr={[1, 1.5]}
      >
        <ParticleSystem count={count} color={color} size={size} speed={speed} />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;