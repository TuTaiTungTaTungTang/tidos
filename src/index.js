import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const images = [
  // Front
  { position: [0, 0, 2], rotation: [0, 0, 0], url: 'img/2.jpg', title: 'Mountain', description: 'A misty mountain landscape with soft light filtering through the clouds, showing layered ridges and distant peaks.' },
  // Back
  { position: [-5.3, 0, -0.2], rotation: [0, 0, 0], url: 'img/3.jpg', title: 'Socrates', description: 'A portrait study capturing a thoughtful, introspective expression with moody lighting and textured background.' },
  { position: [5.3, 0, -0.2], rotation: [0, 0, 0], url: 'img/7.jpg', title: 'Spring', description: 'A gentle scene of early spring blossoms in pastel hues, soft depth of field and delicate petals.' },
  // Left
  { position: [-4, 0, 4.4], rotation: [0, Math.PI / 2.5, 0], url: 'img/4.jpg', title: 'Stars', description: 'A long-exposure capture of the night sky showing star trails circling across the heavens above a dark silhouette.' },
  { position: [-3.8, 0, 8], rotation: [0, Math.PI / 2.5, 0], url: '/img/1.jpg', title: 'Thumbnail', description: 'A small preview-style image used as a tile or placeholder with bold contrast.' },
  // Right
  { position: [4, 0, 4.3], rotation: [0, -Math.PI / 2.5, 0], url: 'img/5.jpg', title: 'Child Drawing', description: 'A child crouched and drawing, surrounded by colorful scribbles—expressive and delicate.' },
  { position: [3.8, 0, 8], rotation: [0, -Math.PI / 2.5, 0], url: 'img/6.jpg', title: 'ColorfulPark', description: 'An impressionistic park path with vivid leaves and reflective wet pavement.' }
]
createRoot(document.getElementById('root')).render(<App images={images} />)
