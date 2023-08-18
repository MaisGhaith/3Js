import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import './style.css'
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
//! scene
const scene = new THREE.Scene();
//! 3 is a raduis - 64 width and height segments 
const geometry = new THREE.SphereGeometry(3, 64, 64); // geometry is just the shape 
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
  roughness: 0.4
})
//! mesh is the companastion between the geometry and material 
const mesh = new THREE.Mesh(geometry, material);
//! we add the mesh to scene
scene.add(mesh);

// ! sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// ! Light
const light = new THREE.PointLight(0xffffff, 1, 100)
// * x y z position of light
light.position.set(0, 10, 10)
light.intensity = 1.25
scene.add(light)

//! here we will add the camera // 45 value is how much the camera will view 
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
//! add camera to the scene
scene.add(camera)



//* render the scene on the screen, we do it using canvas 
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2)
renderer.render(scene, camera);


// ! controls
const contorls = new OrbitControls(camera, canvas);
contorls.enableDamping = true
// contorls.enablePan = false
contorls.enableZoom = false
contorls.autoRotate = true
contorls.autoRotateSpeed = 10

// ! Resize
window.addEventListener('resize', () => {
  //! update size
  console.log(window.innerWidth)
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // ! update camera
  camera.updateProjectionMartix()
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  mesh.rotation.x += 0.2
  light.rotation.y += 10
  // mesh.position.x += 0.1
  contorls.update();
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}

loop()

const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
tl.fromTo('nav', { y: "-100%" }, { y: "0%" })
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 })

// mouse animation color
let mouseDown = false
let rgb = []
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = true))

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageX / sizes.height) * 255),
      150,
    ]
    // let's animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    new THREE.Color(`rgb(0,100,150)`)
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    })
  }
})