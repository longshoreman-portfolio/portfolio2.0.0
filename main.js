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



/* to be tested more
var light = new THREE.DirectionalLight(0xefefff, 1.5);
light.position.set(1, 1, 1).normalize();
scene.add(light);

var light = new THREE.DirectionalLight(0xffefef, 1.5);
light.position.set(-1, -1, -1).normalize();
scene.add(light);
*/

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(10, 10, 10)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight, pointLight)


const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false;

function animateTorus() {
    requestAnimationFrame(animateTorus)

    torus.rotation.x += 0.01
    torus.rotation.y += 0.005
    torus.rotation.z += 0.01

    controls.update()

    renderer.render(scene, camera)
}
animateTorus()


// add other light sources with diff renet color 
// add more shapes
// animate each shape alone 

async function cylinderWithroundedendge(radius, height, curve, smoothness) {
    const points = [];

    points.push(new THREE.Vector2(0,  height / 2))

    for (let i = 0 ; i <= smoothness ; i++) {
        points.push( new THREE.Vector2( (curve / smoothness) * i + radius - curve , Math.sqrt(Math.pow(curve,2) - Math.pow((curve / smoothness) * i ,2)) + height / 2 - curve) )
    }

    for (let i = smoothness ; i >= 0 ; i--) {
        points.push( new THREE.Vector2( (curve / smoothness) * i + radius - curve , - Math.sqrt(Math.pow(curve,2) - Math.pow((curve / smoothness) * i ,2)) - height / 2 + curve) )
    }

    points.push(new THREE.Vector2(0,-height / 2))

    return points
}

const points = await cylinderWithroundedendge(4,10,1,10)
console.log(points)
const geometry6 = new THREE.LatheGeometry(  points ,50);
const material6 = new THREE.MeshStandardMaterial( { color: 0x111111 , side: THREE.DoubleSide});
const lathe = new THREE.Mesh( geometry6, material6 );
lathe.position.set(20, -9, 0)
lathe.scale.set(1, 1, 1);
scene.add( lathe );