import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera( window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20, 1, 1000 )

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerWidth)
camera.position.setZ(50)

renderer.render(scene, camera)

scene.background = new THREE.Color( 0x181822 )


// Torus shape
const geometry = new THREE.TorusGeometry(10, 2.8, 30, 200)
const material = new THREE.MeshStandardMaterial({color:0x111111})
const torus = new THREE.Mesh(geometry, material)
torus.position.set(20, -9, 0)
scene.add(torus)

// sphere
const geometry2 = new THREE.SphereGeometry(3.5, 30, 30)
const material2 = new THREE.MeshStandardMaterial({color:0x4d0099})
const sphere = new THREE.Mesh(geometry2, material2)
sphere.position.set(0, 0, 0)
scene.add(sphere)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(10, 10, 10)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight, pointLight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false;

function animate() {
    requestAnimationFrame(animate)

    torus.rotation.x += 0.01
    torus.rotation.y += 0.005
    torus.rotation.z += 0.01

    controls.update()

    renderer.render(scene, camera)
}
animate()