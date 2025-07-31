"use client"

import { useRef, useState, useEffect, memo, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Float, Text3D, Sphere, MeshDistortMaterial } from "@react-three/drei"
import type { Group } from "three"

// Memoize the GridPoints component
const MemoizedGridPoints = memo(function GridPoints() {
  const pointsRef = useRef<Group>(null)
  const { viewport } = useThree()
  const points = useMemo(() => {
    const gridSize = 10
    const spacing = 2
    const newPoints: Array<[number, number, number]> = []

    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let z = -gridSize; z <= gridSize; z += spacing) {
        const distance = Math.sqrt(x * x + z * z)
        if (distance > 5) {
          newPoints.push([x, -3, z])
        }
      }
    }
    return newPoints
  }, [])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group ref={pointsRef}>
      {points.map((position, i) => (
        <mesh key={i} position={position}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
})

// Memoize the FloatingParticles component
const MemoizedFloatingParticles = memo(function FloatingParticles() {
  const particlesRef = useRef<Group>(null)
  const particles = useMemo(() => {
    const count = 50
    const newParticles: Array<{
      position: [number, number, number]
      speed: number
      size: number
      color: string
    }> = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 10
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = (Math.random() - 0.5) * 10

      newParticles.push({
        position: [x, y, z] as [number, number, number],
        speed: 0.2 + Math.random() * 0.3,
        size: 0.05 + Math.random() * 0.1,
        color: Math.random() > 0.7 ? "#14b8a6" : "#f0f0f0",
      })
    }
    return newParticles
  }, [])

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        const data = particles[i]
        particle.position.y += data.speed * 0.02
        if (particle.position.y > 5) {
          particle.position.y = -5
        }
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
})

// Memoize the DataFlowLines component
const MemoizedDataFlowLines = memo(function DataFlowLines() {
  const linesRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group ref={linesRef} position={[0, 0, 0]}>
      <Sphere args={[8, 16, 16]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#14b8a6"
          attach="material"
          distort={0.3}
          speed={2}
          wireframe
          transparent
          opacity={0.2}
        />
      </Sphere>
    </group>
  )
})

export function MainScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 10, 40]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.5}
      />

      <MemoizedGridPoints />
      <MemoizedFloatingParticles />
      <MemoizedDataFlowLines />
    </Canvas>
  )
}
