import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'

const GOLDENRATIO = 1.61803398875
// Titles that should render in landscape orientation
const LANDSCAPE_TITLES = new Set(['mountain', 'socrates', 'spring'])
// Taller height for landscape frames (can tweak)
const LANDSCAPE_HEIGHT = 1.25

export const App = ({ images }) => (
  <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
    <color attach="background" args={['#191920']} />
    <fog attach="fog" args={['#191920', 0, 15]} />
    <group position={[0, -0.5, 0]}>
      <Frames images={images} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh>
    </group>
    <Environment preset="city" />
  </Canvas>
)

function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      // Center camera vertically based on the actual frame height
      const h = clicked.current.scale.y
      clicked.current.parent.localToWorld(p.set(0, h / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      // Default center assumes portrait height
      p.set(0, 0, 5.5)
      q.identity()
    }
  })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })
  return (
    <group
      ref={ref}
      onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name))}
      onPointerMissed={() => setLocation('/')}>
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, title, description, c = new THREE.Color(), ...props }) {
  const image = useRef()
  const frame = useRef()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url)
  // Display a friendly title if provided, otherwise fall back to the uuid-based name
  const displayName = title ? title : name.split('-').join(' ')
  const isActive = params?.id === name
  const lowerTitle = title ? title.toLowerCase() : ''
  const lowerUrl = url.toLowerCase()
  // Determine orientation: explicit title match or url containing keywords
  const isLandscape = LANDSCAPE_TITLES.has(lowerTitle) || /mountain|socrates|spring/.test(lowerUrl)
  // Frame dimensions and top edge based on orientation
  const frameHeight = isLandscape ? LANDSCAPE_HEIGHT : GOLDENRATIO
  const frameWidth = isLandscape ? GOLDENRATIO : 1
  const topY = frameHeight
  useCursor(hovered)

  //default

  // useFrame((state, dt) => {
  //   image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
  //   easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)
  //   easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt)
  // })

  //full ảnh k crop
  // useFrame((state, dt) => {
  //   if (!image.current || !frame.current) return
  //   // Giữ zoom = 1 để thấy full ảnh
  //   image.current.material.zoom = 1

  //   easing.damp3(
  //     image.current.scale,
  //     [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1],
  //     0.1,
  //     dt
  //   )
  //   easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt)
  // })

  // có hiệu ứng thở 
  useFrame((state, dt) => {
    if (!image.current || !frame.current) return

    const baseZoom = 1 // full ảnh
    const amplitude = 0.1 // dao động rất nhẹ

    const targetZoom = baseZoom + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) * amplitude
    easing.damp(image.current.material, 'zoom', targetZoom, 0.3, dt)

    easing.damp3(
      image.current.scale,
      [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1],
      0.1,
      dt
    )
    easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt)
  })

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[frameWidth, frameHeight, 0.05]}
        position={[0, frameHeight / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      {/* stacked text for a bolder title appearance; positions differ by orientation */}
      {isLandscape ? (
        <>
          {/* Landscape: place title slightly above the top edge */}
          <Text maxWidth={0.2} anchorX="left" anchorY="top" position={[-(GOLDENRATIO / 2) + 0.05, topY + 0.2, 0.001]} fontSize={0.028} color="#ffffff">
            {displayName}
          </Text>
          {description && (
            // Landscape description: place above frame, below title
            <Text maxWidth={0.3} anchorX="left" anchorY="top" position={[-(GOLDENRATIO / 2) + 0.05, topY + 0.15, 0.001]} fontSize={0.02} color="#bdbdbd">
              {description}
            </Text>
          )}
        </>
      ) : (
        <>
          {/* Portrait: place title slightly above the top edge */}
          <Text maxWidth={0.12} anchorX="left" anchorY="top" position={[0.55, topY + 0.06, 0.001]} fontSize={0.028} color="#ffffff">
            {displayName}
          </Text>
          {description && (
            // Portrait description: place above frame, below title
            <Text maxWidth={0.22} anchorX="left" anchorY="top" position={[0.55, topY + 0.02, 0.001]} fontSize={0.02} color="#bdbdbd">
              {description}
            </Text>
          )}
        </>
      )}
    </group>
  )
}
