import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Cylindrical } from 'three'

const scene = new THREE.Scene()

/** Camera */
const camera = new THREE.OrthographicCamera( window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20, 1, 1000 )

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(50)

/** Background */
scene.background = new THREE.Color( 0x181822 )

/** Interaction with shapes */ 
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false;

/** Lights */
const pointLightWhite = new THREE.PointLight(0xffffff ,1, 100 )
pointLightWhite.position.set(10, 10, 10)

const pointLightGreen = new THREE.PointLight(0x00e68a, 1, 30 )
pointLightGreen.position.set(20, -9, 0)

const pointLightOrange = new THREE.PointLight(0xff9900, 1, 100 )
pointLightOrange.position.set(-4, -10, -20)

const pointLightPurple = new THREE.PointLight(0xcc33ff, 1, 100 )
pointLightPurple.position.set(30, 10, -20)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight, pointLightWhite, pointLightGreen, pointLightPurple, pointLightOrange)

/** Materials */
const darkMaterial = new THREE.MeshStandardMaterial({color:0x111111})
const purpleMaterial = new THREE.MeshStandardMaterial({color:0x4d0099})
const greenMaterial = new THREE.MeshStandardMaterial({color:0x00995c, side: THREE.DoubleSide})
const orangeMaterial = new THREE.MeshStandardMaterial({color:0xb36b00, side: THREE.DoubleSide})


/** Torus shape */ 
const geometryTorus = new THREE.TorusGeometry(10, 2.8, 30, 200)
const torus = new THREE.Mesh(geometryTorus, darkMaterial)
torus.position.set(20, -9, 0)
scene.add(torus)

/** Sphere Shape */
const geometrySphere = new THREE.SphereGeometry(3.5, 30, 30)
const sphere = new THREE.Mesh(geometrySphere, purpleMaterial)
sphere.position.set(30, 10, -20)
scene.add(sphere)

/** Cube helper */ 
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

/** Cube shape */  
const geometryCube = new  boxWithRoundedEdges(10, 10, 10, 2, 6, 2)
const cube = new THREE.Mesh(geometryCube, darkMaterial)
cube.position.set(15, 5, -30)

cube.rotation.x = 10
cube.rotation.y = 10
cube.rotation.z = 10

scene.add(cube)

/** Small cube shape */
const geometrySmallCube = new  boxWithRoundedEdges(3, 3, 3, 0.5, 6, 2)
const smallCube = new THREE.Mesh(geometrySmallCube, greenMaterial)
smallCube.position.set(20, -9, 0)

smallCube.rotation.x = -40
smallCube.rotation.y = -20
smallCube.rotation.z = 20

scene.add(smallCube)

/** Cylinder helper */ 
function cylinderWithroundedendge(radius, height, curve, smoothness) {
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

/** Cylinder shpe */
const points = cylinderWithroundedendge(4,9,1,10)
const geometryCylinder = new THREE.LatheGeometry(  points ,50)
const lathe = new THREE.Mesh( geometryCylinder, orangeMaterial )
lathe.position.set(-4, -10, -20)

lathe.rotation.x = 50
lathe.rotation.y = 50
lathe.rotation.z = 50

lathe.scale.set(1, 1, 1);
scene.add( lathe );


/** Animation */ 
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