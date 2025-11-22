import * as THREE from 'three'
import { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'

const GOLDENRATIO = 1.61803398875
// Titles that should render in landscape orientation
const LANDSCAPE_TITLES = new Set(['mountain', 'socrates', 'spring'])
// Base landscape height (can tweak)
const LANDSCAPE_HEIGHT = 1.25
// Scaling factors for enlarging frames
const LANDSCAPE_WIDTH_FACTOR = 1.3
const LANDSCAPE_HEIGHT_FACTOR = 1.5
const PORTRAIT_WIDTH_FACTOR = 1.3
const PORTRAIT_HEIGHT_FACTOR = 1.06

// Loading Screen Component
function LoadingScreen() {
  return (
    <div className="loading-overlay" style={{
      backgroundImage: 'url(img/loading.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2>Đang tải triển lãm...</h2>
        <p>Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  )
}

// Intro Screen Component
function IntroScreen({ onStart }) {
  return (
    <div className="intro-overlay" style={{
      backgroundImage: 'url(img/intro.jpg)', backgroundSize: 'contain', backgroundPosition: 'center'
    }}>
      <div className="intro-content">
        <div className="intro-text">
          <div className="intro-title">
            <h1>Dưới Lớp Áo Trắng</h1>
          </div>
          <div className="intro-description">
            <p>Chào mừng bạn đến với triển lãm nghệ thuật AR độc đáo.</p>
            <p>
              Khám phá không gian ảo với những kiệt tác nghệ thuật,<br />
              tìm hiểu về nét đẹp và ý nghĩa của từng tác phẩm.
            </p>
            <p style={{ fontStyle: 'italic', marginTop: '1em' }}>
              Được phát triển bởi Tidos với niềm đam mê<br />
              mang nghệ thuật đến cuộc sống thông qua công nghệ.
            </p>
          </div>
          <div className="intro-play-button" onClick={onStart}>
            <p>KHÁM PHÁ NGAY</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const App = ({ images }) => {
  const [location, setLocation] = useLocation()
  const [showIntro, setShowIntro] = useState(() => {
    // Chỉ show intro nếu đang ở trang chủ '/', không show nếu đang ở /item/...
    return location === '/'
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleStartGallery = () => {
    setShowIntro(false)
    setIsLoading(true)
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  }

  if (showIntro) {
    return <IntroScreen onStart={handleStartGallery} />
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 70, position: [0, 2, 15] }}
      gl={{ antialias: true }} >
      <color attach="background" args={['#191920']} />
      <fog attach="fog" args={['#191920', 0, 15]} />
      <Suspense fallback={null}>
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
      </Suspense>
    </Canvas>
  )
}

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
      clicked.current.parent.localToWorld(p.set(0, h / 2 + 0.92, 3.2))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      // Default center assumes enlarged portrait height
      p.set(0, 1.5, 12)
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
  const { gl } = useThree()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  const name = getUuid(url)

  const displayName = title ? title : name.split('-').join(' ')
  const isActive = params?.id === name
  const lowerTitle = title ? title.toLowerCase() : ''
  const lowerUrl = url.toLowerCase()

  // Xác định ảnh ngang / dọc
  const isLandscape = LANDSCAPE_TITLES.has(lowerTitle) || /mountain|socrates|spring/.test(lowerUrl)

  // State để lưu kích thước khung dựa trên tỉ lệ ảnh thực
  const [frameDimensions, setFrameDimensions] = useState({
    width: isLandscape ? GOLDENRATIO * LANDSCAPE_WIDTH_FACTOR : 1 * PORTRAIT_WIDTH_FACTOR,
    height: isLandscape ? LANDSCAPE_HEIGHT * LANDSCAPE_HEIGHT_FACTOR : GOLDENRATIO * PORTRAIT_HEIGHT_FACTOR
  })

  const frameWidth = frameDimensions.width
  const frameHeight = frameDimensions.height
  const topY = frameHeight

  useCursor(hovered)


  /// 2
  useEffect(() => {
    const tex = image.current?.material?.map
    // if (!tex) return
    if (!tex || !tex.image) return
    console.log('Texture size', url, tex.image.width, tex.image.height)
    // Anisotropic filtering cho độ nét tối đa
    const maxAniso = gl.capabilities.getMaxAnisotropy?.()
    if (maxAniso) tex.anisotropy = maxAniso
    tex.minFilter = THREE.LinearMipMapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = true
    tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true

    const w = tex.image.width
    const h = tex.image.height
    const imageAspect = w / h

    // Tính kích thước khung dựa trên base size và aspect ratio ảnh
    const baseSize = isLandscape ? 2 : 2.5
    let newWidth, newHeight

    if (imageAspect >= 1) {
      // Landscape: chiều rộng = baseSize, chiều cao = baseSize / aspect
      newWidth = baseSize + 0.5
      newHeight = baseSize / imageAspect + 0.8
    } else {
      // Portrait: chiều cao = baseSize, chiều rộng = baseSize * aspect
      newHeight = baseSize
      newWidth = baseSize * imageAspect
    }

    setFrameDimensions({ width: newWidth, height: newHeight })

    // Zoom = 1 để ảnh hiển thị 100% không crop
    if (image.current?.material) {
      image.current.material.zoom = 0.7
    }

    // Không set scale ở đây, để JSX scale điều khiển
  }, [gl, url, isLandscape])

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[frameWidth, frameHeight, 0.05]}
        position={[0, frameHeight / 2, 0]}>
        <boxGeometry />
        {/* khung ngoài màu đen */}
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />

        {/* Ảnh: zoom=1, scale=1 để hiển thị đúng 100% */}
        <Image
          raycast={() => null}
          ref={image}
          position={[0, 0, 0.51]}
          scale={[frameWidth, frameHeight, 1]}

          url={url}
        />
      </mesh>

      {/* Text như cũ */}
      {isLandscape ? (
        <>
          <Text
            maxWidth={1}
            anchorX="left"
            anchorY="top"
            position={[-(GOLDENRATIO / 2) - 2, topY + 1, 0.1]}
            fontSize={0.1}
            color="#ffffff">
            {displayName}
          </Text>
          {description && (
            <Text
              maxWidth={3}
              anchorX="left"
              anchorY="top"
              position={[-(GOLDENRATIO / 2) - 2, topY + 0.8, 0.1]}
              fontSize={0.05}
              color="#bdbdbd">
              {description}
            </Text>
          )}
        </>
      ) : (
        <>
          <Text
            maxWidth={1}
            anchorX="left"
            anchorY="top"
            position={[-1.2, topY + 1.6, 0.1]}
            fontSize={0.1}
            color="#2e2d2dff">
            {displayName}
          </Text>
          {description && (
            <Text
              maxWidth={1}
              anchorX="left"
              anchorY="top"
              position={[-1.2, topY + 1.4, 0.1]}
              fontSize={0.05}
              color="#4e4d4dff">
              {description}
            </Text>
          )}
        </>
      )}
    </group>
  )
}
