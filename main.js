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
    cameraSnapPositions: [],
    //middleSectionState: []
}

const changeCameraSnapPosition = ( arr ) => {
    global.cameraSnapPositions = [...arr]
}









// * array is a list of svg got from firestore (in dev !!! now !!!  we use a simple array)
const titelsURLs = async (arr) => {
    return await Promise.all(arr.map(async element => {
        const SVGURL=  await storageURL( routes, targetEnverment ) + element.link
        return { name: element.name, svgLink: SVGURL }
    }))
}


// * arr is arr of urls  and names
const getRawTitels = async ( arr ) => {
    return await Promise.all(arr.map( async element => {
        const rawSVG = await loadSVG(element.svgLink)
        return { name: element.name, rawSVG: rawSVG }
    })) 
}

// * arra is array of raw svg from firebase storage and  names
const devidedTitltes = async (arr) => {
    return  await Promise.all(arr.map(async element => {
        const devidedSVG = splitObject(element.rawSVG)
        return { name: element.name, devidedSVG: devidedSVG }
    }))
}

// * arra is array of devided svg from firebase storage and  names
const materilizedtitles = async (arr) => {
    return await Promise.all(arr.map( element => {
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


// *
const scaleMidleSection = ( SVGTitle , n ) => {
    SVGTitle.materilizedSVG[1].scale.setX(n)
    var middleSectionRange = new THREE.Box3().setFromObject( SVGTitle.materilizedSVG[1] )
    var lastSectionRange = new THREE.Box3().setFromObject( SVGTitle.materilizedSVG[2] )
    SVGTitle.materilizedSVG[1].translateX( (middleSectionRange.min.x-lastSectionRange.min.x)/n - middleSectionRange.min.x+lastSectionRange.min.x) // how much to translate midel section 
    SVGTitle.materilizedSVG[0].translateX( -(middleSectionRange.max.x - middleSectionRange.min.x)*(1-n)/n )   // how much  to translate the last part
}




// todo: add the svg to the scene function 
// todo: scale function 
// todo: lerp function
// todo: camera positions function
// todo: camera movment function
// todo: camera move by scroll function
// todo: camera move by nav bar link function
// todo: camera move by swipe function

// ! scale function starts form 0 go up to 1 then down to 0




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

const myTitles = async (obj) => { 
    const titles = await getTitelsList()
    const svgURLs = await titelsURLs(titles)
    const rawTitles = await getRawTitels(svgURLs)
    const devidedTitles = await devidedTitltes(rawTitles)
    const materilizedTitles = await materilizedtitles(devidedTitles)

    return {
        ...obj,
        titles:materilizedTitles
    }
}

 


/** texture loader  */

/** Debug */
const size = 800
const divisions = 10
const gridHelper = new THREE.GridHelper( size, divisions )



var cameraSnapPositions = []
var titles = []
console.log( titles )




/** Canvas */
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
})

/** Scene */
const scene = new THREE.Scene()




/** Materials */
// const darkMaterial = new THREE.MeshStandardMaterial({color:0x111111})
// const purpleMaterial = new THREE.MeshStandardMaterial({color:0x4d0099})
// const greenMaterial = new THREE.MeshStandardMaterial({color:0x00995c, side: THREE.DoubleSide})
// const orangeMaterial = new THREE.MeshStandardMaterial({color:0xb36b00, side: THREE.DoubleSide})

/** Mesh */




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

    
        /** Animate Cylinder */

    
        /** Animate cube */
        /** Cube translation */
    
        /** Cube rotation */

    
        /** Animate small cube */

    
        /** Animation shpere */

    
        renderer.render(scene, camera)
        i += 1
        //console.log(j)
        i === 400   ?   i=0 :   null
        i === 0     ?   j++ :   null
        //j === 4     ?   camera.position.setX( -100 ) : null
        j === 4     ?   j=0 :   null


        // todo abstract to function 
        camera.position.lerp(new THREE.Vector3(global.cameraSnapPositions[j],15,100),.05)


        console.log(camera.position)
        // * when the animation starts : when the j changes 
        // todo scale up to 1 in linear way
        //global.titles.forEach(element => {scaleMidleSection(element, (i+1)/400)})


        // * when the animation ends : when  camera.position === is a const 
        // todo scale down to 0.01 in linear way

        // ! here go the scale function for the middle section
       // manageMiddleSection( j )

        


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







async function func () {
    // todo abstract this to a function
    if (targetEnverment() === "emulator") {
        connectStorageEmulator( appStorage, "localhost", 9199)
        //const SVGURL = await fetchDownloadURL(mySVGRef)
        //loadSVG(SVGURL)
        
    }

    if (targetEnverment() === "development") {

        // todo: to abstract
        // todo: create a new array with objects and the name
        // * to get  from the global

        //global = await myTitles(global)
        let  myTitelsSVGs = global.titles

        // const myTitelsSVGs = await Promise.all(mySVGsMoch.map(async element => {
           
        //     const SVGURL = await storageURL( routes, targetEnverment ) + element.link


        //     const rawSVG = await loadSVG(SVGURL)

        //     const devidedSVG = splitObject(rawSVG)

        //     return {
        //         name: element.name, 
        //         svg: [ ...devidedSVG ], 
        //         materilizedSVG: [
        //             materilizeSVG(devidedSVG[0]),
        //             materilizeSVG(devidedSVG[1]),
        //             materilizeSVG(devidedSVG[2])
        //         ]
        //     }
        // }))


        /** init */
        var proprtion = {n: .01}
        var arr = myTitelsSVGs[0]
        titles = [...myTitelsSVGs]
        const changeProprtion = (value) => {
            {n: value}
        }

        // add the svg to the scene and scale middle section
        for(let i = 0; i < myTitelsSVGs.length; i++) {
            for ( let j = 0; j < 3; j++ ) {
                // todo change the 100 to be proprtional to the screen size
                myTitelsSVGs[i].materilizedSVG[j].position.setX(i*100)
               // j === 1 ? myTitelsSVGs[i].materilizedSVG[1].scale.setX(proprtion.n) : null
                scene.add(myTitelsSVGs[i].materilizedSVG[j])
            }
        }

        

        //  translate the midle section and the last section
        // var box = new THREE.Box3().setFromObject( arr.materilizedSVG[1] )
        // var box3 = new THREE.Box3().setFromObject( arr.materilizedSVG[2] )
        // arr.materilizedSVG[1].translateX( (box.min.x-box3.min.x)/proprtion.n - box.min.x+box3.min.x) // how much to translate midel section 
        // arr.materilizedSVG[0].translateX( -(box.max.x - box.min.x)*(1-proprtion.n)/proprtion.n )   // how much  to translate the last part 



        //center camera on the model
        var box1 = new THREE.Box3().setFromObject( arr.materilizedSVG[2] )
        var box2 = new THREE.Box3().setFromObject( arr.materilizedSVG[0] )
        camera.position.setX(  (box2.max.x+box1.min.x)/2)


        // camera snap positions
        cameraSnapPositions = myTitelsSVGs.map(
            (element) => {  
                var box1 = new THREE.Box3().setFromObject( element.materilizedSVG[2] )
                var box2 = new THREE.Box3().setFromObject( element.materilizedSVG[0] )
                return  (box2.max.x+box1.min.x)/2
            }
        )
        console.log(cameraSnapPositions)
        
        global = {...global, cameraSnapPositions: [...cameraSnapPositions]}





        
        


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


const mySVGRef = ref( appStorage, 'about-me.svg')

global = await myTitles(global)
console.log(global)
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

// ! important handle the waiting time  when loading ... all stuff use the xhr



// * doc 
// ? whaat 
// normal 


const manageMiddleSection = ( n ) => {

}




const centerCameraOnTitle = ( SVGTitle ) => {
    var firstSectionRange = new THREE.Box3().setFromObject( arr.materilizedSVG[0] )
    var lastSectionRange = new THREE.Box3().setFromObject( arr.materilizedSVG[2] )
    camera.position.setX(  (firstSectionRange.max.x + lastSectionRange.min.x)/2)
}




// todo make all middle section null 
global.titles.length!==0?  global.titles.forEach(element => {scaleMidleSection(element,.01)}) : null



