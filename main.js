import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera( window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20, 1, 1000 )

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(50)

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
sphere.position.set(30, 10, -20)
scene.add(sphere)

// cube 
const geometry3 = new  boxWithRoundedEdges(10, 10, 10, 2, 6, 2)
const material3 = new THREE.MeshStandardMaterial({color:0x111111})
const cube = new THREE.Mesh(geometry3, material3)
cube.position.set(15, 5, -15)

cube.rotation.x = 10
cube.rotation.y = 10
cube.rotation.z = 10

scene.add(cube)


function boxWithRoundedEdges(width, height, depth, radius0, smoothness) {
    let shape = new THREE.Shape();
    let eps = 0.00001;
    let radius = radius0 - eps;
    shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
    shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
    shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true);
    shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
    let geometry = new THREE.ExtrudeBufferGeometry(shape, {
        depth: depth - radius0 * 2,
        bevelEnabled: true,
        bevelSegments: smoothness * 2,
        steps: 1,
        bevelSize: radius,
        bevelThickness: radius0,
        curveSegments: smoothness
    });
 
    geometry.center();
 
    return geometry;
}







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