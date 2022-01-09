import './style.css'

import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

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