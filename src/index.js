import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: '/images/mountain.jpg', title: 'Mountain', description: 'A misty mountain landscape with soft light filtering through the clouds, showing layered ridges and distant peaks.' },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: '/images/socrates.jpg', title: 'Socrates', description: 'A portrait study capturing a thoughtful, introspective expression with moody lighting and textured background.' },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: '/images/spring.jpg', title: 'Spring', description: 'A gentle scene of early spring blossoms in pastel hues, soft depth of field and delicate petals.' },
  // Left
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: '/images/stars.jpg', title: 'Stars', description: 'A long-exposure capture of the night sky showing star trails circling across the heavens above a dark silhouette.' },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: '/images/sunday.jpg', title: 'Sunday', description: 'An atmospheric street scene on a quiet Sunday morning, empty sidewalks and soft light.' },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: '/images/wave.jpg', title: 'Thumbnail', description: 'A small preview-style image used as a tile or placeholder with bold contrast.' },
  // Right
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: '/images/child.jpeg', title: 'Child Drawing', description: 'A child crouched and drawing, surrounded by colorful scribbles—expressive and delicate.' },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: '/images/lake.jpg', title: 'Venice Canal', description: 'A sunlit canal with gondolas and historic buildings—warm tones and painterly texture.' },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: '/images/rainy.jpg', title: 'Colorful Park', description: 'An impressionistic park path with vivid leaves and reflective wet pavement.' }
]
createRoot(document.getElementById('root')).render(<App images={images} />)
