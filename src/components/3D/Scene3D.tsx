import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Float, 
  Text3D, 
  Center,
  Sparkles,
  Stars,
  Cloud,
  Sky,
  ContactShadows,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Sphere,
  Box,
  Cylinder,
  Torus,
  Plane
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Scene3DProps {
  type: 'hero' | 'finance' | 'about' | 'services' | 'floating';
  className?: string;
}

// Animated 3D Sphere Component
const AnimatedSphere = ({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} position={position} scale={scale} args={[1, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

// Animated 3D Torus Component
const AnimatedTorus = ({ position, color }: { position: [number, number, number], color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.z += 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
      <Torus ref={meshRef} position={position} args={[1, 0.4, 16, 100]}>
        <MeshWobbleMaterial
          color={color}
          attach="material"
          factor={0.6}
          speed={2}
          roughness={0.1}
          metalness={0.9}
        />
      </Torus>
    </Float>
  );
};

// 3D Text Component
const Text3DComponent = ({ text, position, color = "#3B82F6" }: { text: string, position: [number, number, number], color?: string }) => {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <Center position={position}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text}
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </Text3D>
      </Center>
    </Float>
  );
};

// Financial Icons 3D
const FinancialIcon3D = ({ type, position }: { type: 'coin' | 'chart' | 'bank', position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  const renderIcon = () => {
    switch (type) {
      case 'coin':
        return (
          <Cylinder args={[0.5, 0.5, 0.1, 32]}>
            <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
          </Cylinder>
        );
      case 'chart':
        return (
          <group>
            <Box position={[-0.3, -0.2, 0]} args={[0.1, 0.4, 0.1]}>
              <meshStandardMaterial color="#10B981" />
            </Box>
            <Box position={[0, 0, 0]} args={[0.1, 0.8, 0.1]}>
              <meshStandardMaterial color="#3B82F6" />
            </Box>
            <Box position={[0.3, 0.2, 0]} args={[0.1, 1.2, 0.1]}>
              <meshStandardMaterial color="#8B5CF6" />
            </Box>
          </group>
        );
      case 'bank':
        return (
          <group>
            <Box position={[0, -0.3, 0]} args={[1.2, 0.2, 0.8]}>
              <meshStandardMaterial color="#6B7280" />
            </Box>
            <Box position={[-0.3, 0, 0]} args={[0.1, 0.6, 0.1]}>
              <meshStandardMaterial color="#F3F4F6" />
            </Box>
            <Box position={[0, 0, 0]} args={[0.1, 0.6, 0.1]}>
              <meshStandardMaterial color="#F3F4F6" />
            </Box>
            <Box position={[0.3, 0, 0]} args={[0.1, 0.6, 0.1]}>
              <meshStandardMaterial color="#F3F4F6" />
            </Box>
            <Box position={[0, 0.4, 0]} args={[1.4, 0.1, 0.9]}>
              <meshStandardMaterial color="#374151" />
            </Box>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <group ref={meshRef} position={position} scale={0.8}>
        {renderIcon()}
      </group>
    </Float>
  );
};

// Hero Scene
const HeroScene = () => {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#3B82F6" intensity={0.5} />
      
      <AnimatedSphere position={[-3, 2, -2]} color="#3B82F6" scale={1.2} />
      <AnimatedSphere position={[3, -1, -3]} color="#8B5CF6" scale={0.8} />
      <AnimatedTorus position={[0, 1, -4]} color="#10B981" />
      
      <Text3DComponent text="DIGC" position={[0, 0, 0]} color="#FFD700" />
      
      <Sparkles count={100} scale={10} size={2} speed={0.4} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4} />
    </>
  );
};

// Finance Scene
const FinanceScene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} color="#10B981" intensity={0.3} />
      
      <FinancialIcon3D type="coin" position={[-2, 1, 0]} />
      <FinancialIcon3D type="chart" position={[0, 0, -1]} />
      <FinancialIcon3D type="bank" position={[2, -1, 0]} />
      
      <AnimatedSphere position={[-4, 0, -3]} color="#10B981" scale={0.6} />
      <AnimatedSphere position={[4, 2, -2]} color="#3B82F6" scale={0.8} />
      
      <Sparkles count={50} scale={5} size={1} speed={0.2} />
    </>
  );
};

// About Scene
const AboutScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 3]} intensity={0.7} />
      
      <group>
        {Array.from({ length: 8 }, (_, i) => (
          <AnimatedSphere
            key={i}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 3,
              Math.sin((i / 8) * Math.PI * 2) * 2,
              -2
            ]}
            color={`hsl(${(i * 45) % 360}, 70%, 60%)`}
            scale={0.5}
          />
        ))}
      </group>
      
      <Text3DComponent text="UNITY" position={[0, 0, 0]} color="#8B5CF6" />
      
      <Cloud position={[-4, 2, -5]} speed={0.2} opacity={0.3} />
      <Cloud position={[4, -2, -5]} speed={0.3} opacity={0.2} />
    </>
  );
};

// Services Scene
const ServicesScene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 2, 2]} intensity={0.6} />
      
      <Float speed={1} rotationIntensity={1} floatIntensity={1}>
        <group>
          <AnimatedTorus position={[0, 0, 0]} color="#EF4444" />
          <AnimatedSphere position={[0, 0, 0]} color="#3B82F6" scale={0.5} />
        </group>
      </Float>
      
      <AnimatedSphere position={[-3, 1, -2]} color="#10B981" scale={0.7} />
      <AnimatedSphere position={[3, -1, -2]} color="#F59E0B" scale={0.9} />
      
      <Sparkles count={30} scale={3} size={1.5} speed={0.3} />
    </>
  );
};

// Floating Scene (for smaller components)
const FloatingScene = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 2]} intensity={0.4} />
      
      <AnimatedSphere position={[0, 0, 0]} color="#3B82F6" scale={0.8} />
      <Sparkles count={20} scale={2} size={1} speed={0.5} />
    </>
  );
};

const Scene3D: React.FC<Scene3DProps> = ({ type, className = "" }) => {
  const sceneComponent = useMemo(() => {
    switch (type) {
      case 'hero': return <HeroScene />;
      case 'finance': return <FinanceScene />;
      case 'about': return <AboutScene />;
      case 'services': return <ServicesScene />;
      case 'floating': return <FloatingScene />;
      default: return <FloatingScene />;
    }
  }, [type]);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        performance={{ min: 0.5 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Environment preset="sunset" />
          {sceneComponent}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;