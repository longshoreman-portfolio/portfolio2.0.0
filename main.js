import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

import { loadSVG, materilizeSVG, splitObject } from './helpers/svg-helper.js'

import { storageURL, fetchDownloadURL, loadModel, addModelToScene } from './helpers/model'    


import * as dat from 'dat.gui'



import {  ref, getDownloadURL , connectStorageEmulator } from "firebase/storage";

import { app , appStorage }  from './firebase-config.js'

import {boxWithRoundedEdges, cylinderWithroundedendge } from './helpers/shaps.js'

import { routes } from './router'
import { async } from '@firebase/util'


/** global */

var global = {
    camera: {position: new THREE.Vector3(0,15,100)},
    titles: [],
    cameraSnapPosition: [] 
}

const changeCameraSnapPosition = ( arr ) => {
    global.cameraSnapPosition = [...arr]
}




 


/** texture loader  */

/** Debug */
const size = 200
const divisions = 10
const gridHelper = new THREE.GridHelper( size, divisions )



var cameraSnapPosition = []
var titles = []
console.log( titles )


const lerpScaleMidleSection = ( SVGTitle , lerp ) => {
    var box = new THREE.Box3().setFromObject( SVGTitle.materilizedSVG[1] )
    var box3 = new THREE.Box3().setFromObject( SVGTitle.materilizedSVG[2] )
    SVGTitle.materilizedSVG[1].translateX( (box.min.x-box3.min.x)/lerp - box.min.x+box3.min.x) // how much to translate midel section 
    SVGTitle.materilizedSVG[0].translateX( -(box.max.x - box.min.x)*(1-lerp)/lerp )   // how much  to translate the last part     
}


/** Canvas */
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
})

/** Scene */
const scene = new THREE.Scene()


/** Objects */
// Torus
const geometryTorus = new THREE.TorusGeometry(10, 2.8, 30, 200)

// Sphere
const geometrySphere = new THREE.SphereGeometry(3.5, 30, 30)

//Big Cube 
const geometryCube = new  boxWithRoundedEdges(10, 10, 10, 2, 6, 2)

//Small Cube
const geometrySmallCube = new  boxWithRoundedEdges(3, 3, 3, 0.5, 6, 2)

//Cylinder
const points = cylinderWithroundedendge(4,9,1,10)
const geometryCylinder = new THREE.LatheGeometry(  points ,50)

/** Materials */
const darkMaterial = new THREE.MeshStandardMaterial({color:0x111111})
const purpleMaterial = new THREE.MeshStandardMaterial({color:0x4d0099})
const greenMaterial = new THREE.MeshStandardMaterial({color:0x00995c, side: THREE.DoubleSide})
const orangeMaterial = new THREE.MeshStandardMaterial({color:0xb36b00, side: THREE.DoubleSide})

/** Mesh */
//torus
const torus = new THREE.Mesh(geometryTorus, darkMaterial)
torus.position.set(20, -9, 0)           //TODO: not sure where to put this
scene.add(torus)

// Sphere
const sphere = new THREE.Mesh(geometrySphere, purpleMaterial)
sphere.position.set(30, 10, -20)        //TODO: not sure where to put this
scene.add(sphere)

//Big Cube
const cube = new THREE.Mesh(geometryCube, darkMaterial)
cube.position.set(15, 5, -30)

cube.rotation.x = 10
cube.rotation.y = 10
cube.rotation.z = 10

scene.add(cube)

//Small Cube
const smallCube = new THREE.Mesh(geometrySmallCube, greenMaterial)
smallCube.position.set(20, -9, 0)

smallCube.rotation.x = -40
smallCube.rotation.y = -20
smallCube.rotation.z = 20

scene.add(smallCube)

//Cylinder
const cylinder = new THREE.Mesh( geometryCylinder, orangeMaterial )
cylinder.position.set(-4, -10, -20)

cylinder.rotation.x = 50
cylinder.rotation.y = 50
cylinder.rotation.z = 50

cylinder.scale.set(1, 1, 1);
scene.add( cylinder );

/** import icon example */ 






/** Lights */
const pointLightWhite = new THREE.PointLight(0xffffff ,1, 100 )
pointLightWhite.position.set(10, 10, 10)

const pointLightGreen = new THREE.PointLight(0x00e68a, 1, 100 )
pointLightGreen.position.set(20, -9, 0)

const pointLightOrange = new THREE.PointLight(0xff5c33, 1, 100 )
pointLightOrange.position.set(-4, -10, -20)

const pointLightPurple = new THREE.PointLight(0xcc33ff, 1, 100 )
pointLightPurple.position.set(30, 10, -20)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight , pointLightWhite, pointLightGreen, pointLightPurple, pointLightOrange)




scene.add( gridHelper )

/** Sizes */

//  // TODO: This not a good approach. Try change the camera position instead of the scaling everything.


    //Update sizes
    //Update camera
    //Update renderer

// // TODO try this code for the resizing
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
 

/** Camera */
    //Base camera
    //Controls
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth  / window.innerHeight, 1, 1000 )
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.setZ(100)
    camera.position.setY(15)
    camera.position.setX(0)
/** Renderer */





var params = {
    x: 0
}

var gui = new dat.GUI();

gui.add(params, 'x', -50,400).step(1).onChange(function(value){
        changeCameraX(value);
}) 

function changeCameraX(value){
    camera.position.x = value
}



camera.lookAt(new THREE.Vector3(0,0,0))

/** Interaction with shapes */ 
// TODO: to be replaced by the raycaster
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableZoom = false;

/** Animate */
    //Update objects
    //Update Orbital Controls
    //controls.update()
    //Render
    //Call tick again on the next frame


    /** Animation loop */
    var cubeDiractionX = false
    var cubeDiractionY = false

    var shpereGrowing = true
    var i = 0
    var j = 0

    function animateLoop() {


        requestAnimationFrame(animateLoop)
    
        /** Animate torus */
        torus.rotation.x += 0.01
        torus.rotation.y += 0.005
        torus.rotation.z += 0.01
    
        /** Animate Cylinder */
        cylinder.rotation.x += 0.01
        cylinder.rotation.y += 0.03
    
        /** Animate cube */
        /** Cube translation */
        cubeDiractionX ? cube.position.x -= 0.05 : cube.position.x += 0.05
        cube.position.x >= 15 ? cubeDiractionX = true : null
        cube.position.x <= -5 ? cubeDiractionX = false : null
    
        cubeDiractionY ? cube.position.y -= 0.05 : cube.position.y += 0.05
        cube.position.y >= 15 ? cubeDiractionY = true : null
        cube.position.y <= -5 ? cubeDiractionY = false : null
    
        /** Cube rotation */
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        cube.rotation.z += 0.01
    
        /** Animate small cube */
        smallCube.rotation.x += 0.005
        smallCube.rotation.y += 0.005
        smallCube.rotation.z += 0.005
    
        /** Animation shpere */
        shpereGrowing ? sphere.scale.x += 0.001 : sphere.scale.x -= 0.001
        shpereGrowing ? sphere.scale.y += 0.001 : sphere.scale.y -= 0.001
        shpereGrowing ? sphere.scale.z += 0.001 : sphere.scale.z -= 0.001
        sphere.scale.x >= 1.4 ? shpereGrowing = false : null
        sphere.scale.x <= 0.6 ? shpereGrowing = true : null
    
        renderer.render(scene, camera)
        i += 1
        //console.log(j)
        i === 400   ?   i=0 :   null
        i === 0     ?   j++ :   null
        //j === 4     ?   camera.position.setX( -100 ) : null
        j === 4     ?   j=0 :   null



        camera.position.lerp(new THREE.Vector3(cameraSnapPosition[j],15,100),.05)

        


        // todo make illusion of infinty loop (how to do it when the new obj can be seen whit odl one)
        // * idea what if i teleport the first object to after the last one and then teleport it back with the camera to the beginning
        // * when we are at j 3 we teleport the obj0 to postion 4 
        // * when we are at j 4 we teleport the obj0  and the camera to postion 0 

        
        
        // lerpScaleMidleSection(titles[j],(i+1)/400)

        // todo call the midel scale down  function 
        // todo change color
        // todo add movement  to models around the title 
        // todo 










    }
    animateLoop()

/** Background */
// TODO: Add a function to change the background color with the scroll. 
scene.background = new THREE.Color( 0x808080 )


// TODO add centred nav bar 
// TODO add about drop down full screen 
// TODO avatar 
// TODO add text working on Page

// TODO: stop animation when the window is not in focus.


/** backlog*/ 
// TODO Create a horizontal scene
// // todo add GUI
// todo use gui
// // TODO test the new resizing concept
// // TODO: Add SDKs for Firebase products that you want to use




const fbxLoader = new FBXLoader()

const myModelRef = ref( appStorage, 'letter.fbx')

// todo abstract this
let targetEnverment = () => {
    return  (process.env.NODE_ENV === "production" && location.hostname === "localhost") ? "emulator"
        :   process.env.NODE_ENV
}




// // todo : make conditions for the different envs (dev, prod, emulator)
// // todo we can change loadModel to be function that takes the url as an argument
// // TODO remove this finction 


// todo: add the scene as argument to the function loadModel
const addObjToScene = ( url ) => {
    fbxLoader.load( url, 
        (object) => {
            object.scale.set(.1, .1, .1)
            scene.add(object)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log('error:', error)
        }
    )  
}


const myModelsInfoMoch = [
    {name: "letter"},
    {name: "HTML"},
]
const mySVGsMoch = [ 
    {
        name: "my-story",
        link: "svg/my-story.svg"
    },
    {
        name: "my-work",
        link: "svg/my-work.svg"
    },
    {
        name: "reach-out",
        link: "svg/reach-out.svg"
    },
    {
        name: "buy-me-a-coffee",
        link: "svg/buy-me-a-coffee.svg"
    },
]



// TODO new data schema for firestore collection collection { name: "contact",  models [ array of modal gonna be used in contact component] } all files gonna be in the same folder 
 




// TODO refactor : abstract the env checking process to a function and move it to a diff drectory (env || config)S
// todo remove assets dir form git





async () => {
    // todo abstract this to a function
    if (targetEnverment() === "emulator") {
        connectStorageEmulator( myStorage, "localhost", 9199)
        const modelURL = await fetchDownloadURL(myModelRef)
        const model = await loadModel(modelURL)
        addModelToScene(model,scene)
        // todo devide this funciton to two functions

    }

    if (targetEnverment() === "development") {
        const url = storageURL( routes, targetEnverment ) +  myModelsInfoMoch[1].name + ".fbx"
        addModelToScene(  await loadModel(url) ,scene )
    }



    if ( targetEnverment() === "production" ) {
        const modelURL = await fetchDownloadURL(myModelRef)
        const model = await loadModel(modelURL)
        addModelToScene(model,scene)
    }
}




// todo: emulator firestore
// todo: create a fucntion that fetch all the colloections of the models from firestore
// todo: create a function that takes as argument collection name and returns the array of models names
// todo: create a function that takes as argument an array of models names and retuens an array of objcts with the mode name and the url of the model in the farebase storage
// todo: create a function that takes as argument an array of objects and a postion function render all the models in the scene 
// todo: craete a function that returns a random position
// todo: ditch the random position and use only three or four models that turns => so create a function that retern positions 



// // todo: function to loadobject 
// // todo: function to add object to the scene
// // todo: function for the positon 
// // todo: function to scale models




// // todo: create a function that takes as argumnet model ref and retuns download url





const mySVGRef = ref( appStorage, 'about-me.svg')



async function func () {
    // todo abstract this to a function
    if (targetEnverment() === "emulator") {
        connectStorageEmulator( appStorage, "localhost", 9199)
        const SVGURL = await fetchDownloadURL(mySVGRef)
        //loadSVG(SVGURL)
        
    }

    if (targetEnverment() === "development") {

        // todo: to abstract
        // todo: create a new array with objects and the name
        // * to get  from the global
        const myTitelsSVGs = await Promise.all(mySVGsMoch.map(async element => {
           
            const SVGURL = await storageURL( routes, targetEnverment ) + element.link
            console.log('SVGURL:', SVGURL)

            const rawSVG = await loadSVG(SVGURL)
            console.log('rawSVG:', rawSVG)

            const devidedSVG = splitObject(rawSVG)
            console.log('devidedSVG:', devidedSVG)

            //scene.add( materilizeSVG(devidedSVG[0]))
            return {
                name: element.name, 
                svg: [ ...devidedSVG ], 
                materilizedSVG: [
                    materilizeSVG(devidedSVG[0]),
                    materilizeSVG(devidedSVG[1]),
                    materilizeSVG(devidedSVG[2])
                ]
            }
        }))


        /** init */
        var proprtion = {n: 1}
        var arr = myTitelsSVGs[0]
        titles = [...myTitelsSVGs]
        const changeProprtion = (value) => {
            {n: value}
        }

        for(let i = 0; i < myTitelsSVGs.length; i++) {
            for ( let j = 0; j < 3; j++ ) {
                myTitelsSVGs[i].materilizedSVG[j].position.setX(i*100)
                j === 1 ? myTitelsSVGs[i].materilizedSVG[1].scale.setX(proprtion.n) : null
                scene.add(myTitelsSVGs[i].materilizedSVG[j])
            }
        }

       
        var box = new THREE.Box3().setFromObject( arr.materilizedSVG[1] )
        var box3 = new THREE.Box3().setFromObject( arr.materilizedSVG[2] )
        arr.materilizedSVG[1].translateX( (box.min.x-box3.min.x)/proprtion.n - box.min.x+box3.min.x) // how much to translate midel section 
        arr.materilizedSVG[0].translateX( -(box.max.x - box.min.x)*(1-proprtion.n)/proprtion.n )   // how much  to translate the last part 


         //center camera on the model
        var box1 = new THREE.Box3().setFromObject( arr.materilizedSVG[2] )
        var box2 = new THREE.Box3().setFromObject( arr.materilizedSVG[0] )
        camera.position.setX(  (box2.max.x+box1.min.x)/2)
        //console.log('w',(box2.max.x+box1.min.x)/2)

        // camera snap position 

        cameraSnapPosition = myTitelsSVGs.map(
            (element) => {  
                var box1 = new THREE.Box3().setFromObject( element.materilizedSVG[2] )
                var box2 = new THREE.Box3().setFromObject( element.materilizedSVG[0] )
                return  (box2.max.x+box1.min.x)/2
            }
        )

        //camera.position.lerp(new THREE.Vector3(cameraSnapPosition[1],15,100),.05)
        
        //console.log( cameraSnapPosition[1]- cameraSnapPosition[0] )

        //console.log('cameraSnapPosition:', cameraSnapPosition)

        // change the camera position on wheel movment 
        // window.addEventListener('wheel', onMouseWheel)
        // let Y = 0
        // let position = 0

        // function onMouseWheel (event) {
        //     console.log(event.deltaY) 
        //     (event.deltaY > 0) ? position = position + 1 : position = position - 1
        // }



        const scaleMidleSection = ( SVGTitle , n ) => {
            var box = new THREE.Box3().setFromObject( SVGTitle.materilizedSVG[1] )
            var box3 = new THREE.Box3().setFromObject( SVGTitle.materilizedSVG[2] )
            SVGTitle.materilizedSVG[1].translateX( (box.min.x-box3.min.x)/n - box.min.x+box3.min.x) // how much to translate midel section 
            SVGTitle.materilizedSVG[0].translateX( -(box.max.x - box.min.x)*(1-n)/n )   // how much  to translate the last part     
        }



        /** when change */

        gui.add(proprtion,'n', 0.05,1).step(.05).onChange((value) => {
            changeProprtion(value)
            for(let i = 0; i < myTitelsSVGs.length; i++) {
                for ( let j = 0; j < 3; j++ ) {
                    myTitelsSVGs[i].materilizedSVG[j].position.setX(i*100 -200)
                    j === 1 ? myTitelsSVGs[i].materilizedSVG[1].scale.setX(proprtion.n) : null
                }
            }
            myTitelsSVGs.forEach(element => {
                scaleMidleSection(element, proprtion.n )
            })
        
        }) 


    }

 

    if ( targetEnverment() === "production" ) {

        const SVGURL = await fetchDownloadURL(mySVGRef)
        //loadSVG(SVGURL)
    }
}

func ()



// ! todo: refacto 
// * global stuff : try redux approach the store
// * camera position 
// * title objects 
// *  

// todo: find the  best distence between the titels 
// todo: chnage camera position for each screen size

// todo: create funciton to change camera position : 1. by time 2. by nav bar link

// ! solve  impure functions isues 

// ! important  create three js carousel function that takes svgs and elements and add to the scene carousel  
// * spec: 



// * doc 
// ? whaat 
// normal 






// * array is a list of svg got from firestore (in dev !!! now !!!  we use a simple array)
const titelsURLs = async (arr) => {
    console.log("d1", arr)
    return await Promise.all(arr.map(async element => {
        const SVGURL=  await storageURL( routes, targetEnverment ) + element.link
        return { name: element.name, svgLink: SVGURL }
    }))
}


// * arr is arr of urls  and names
const getRawTitels = async ( arr ) => {
    console.log("d2", arr)
    return await Promise.all(arr.map(element => {
        const SVGURL = element.svgLink
        const rawSVG = loadSVG(SVGURL)
        return { name: element.name, rawSVG: rawSVG }
    })) 
}

// * arra is array of raw svg from firebase storage and  names
const devidedTitltes = (arr) => {
    console.log("d3", arr)
    return arr.map(element => {
        console.log('debug', element.rawSVG)
        const devidedSVG = splitObject(element.rawSVG)
        return { name: element.name, devidedSVG: devidedSVG }
    })
}

// * arra is array of devided svg from firebase storage and  names
const materilizedtitles = async (arr) => {
    return await Promise.all(arr.map(async element => {
        return {
            name: element.name, 
            svg: [ ...element.devidedSVG ], 
            materilizedSVG: [
                materilizeSVG(element.devidedSVG[0]),
                materilizeSVG(element.devidedSVG[1]),
                materilizeSVG(element.devidedSVG[2])
            ]
        }
    }))
}

// from firestore 
// ! this is a moch
const getTitelsList = async () => {
    return  [ 
        {
            name: "my-story",
            link: "svg/my-story.svg"
        },
        {
            name: "my-work",
            link: "svg/my-work.svg"
        },
        {
            name: "reach-out",
            link: "svg/reach-out.svg"
        },
        {
            name: "buy-me-a-coffee",
            link: "svg/buy-me-a-coffee.svg"
        },
    ]
}


// * this to abstract the process of get  the svg from firebase storage

const myTitles = async (ojb) => { 
    const titles = await getTitelsList()
    const svgURLs = await titelsURLs(titles)
    const rawTitles = await getRawTitels(svgURLs)
    const devidedTitles = devidedTitltes(rawTitles)
    const materilizedTitles = await materilizedtitles(devidedTitles)

    return {
        ...obj,
        titles:materilizedTitles
    }
}









console.log('myGlobe1',global)

global = await myTitles(global)

console.log('myGlobe2', global)