import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'



import { addModelToScene } from './helpers/model'    

import fetchDownloadURL from './service/firebase/fetch-download-url'

import splitObject from './utilities/split-object'

import envermentStorage from './utilities/enverment-storage-url'



import * as dat from 'dat.gui'



import {  ref, getDownloadURL , connectStorageEmulator } from 'firebase/storage'

import { app, appStorage, db }  from './firebase-config'

import {boxWithRoundedEdges, cylinderWithroundedendge } from './helpers/shaps'

import { routes } from './router'

import { async } from '@firebase/util'

import easeInOutQuint from './utilities/animation/ease-in-out-quint'
import easeInOutSin from './utilities/animation/ease-in-out-sin'

import loadAsset from './utilities/load-asset'

import targetEnverment from './utilities/target-enverment'

import titelsURLs from './utilities/titles-urls'

import divideTitles from  './utilities/divide-titles'

import getRawTitles from './lib/three-js/get-raw-titles'

import materilizeTitles from './utilities/materilize-titles'

import { titlesList } from './data/titles-list'

import { lists } from './data/lists'

import fetchAllDocs from './service/firebase/fetch-firebase'

import refrenceAssets from './service/firebase/refrence-assets'

import getAssetsList from './service/firebase/get-assets-list'

import downloadURLs from './service/firebase/download-urls'

/** global */
//!!! impotatnt !!!
//todo: ditch the global letiable maybe use clouser ! 


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth  / window.innerHeight, 1, 1000 )

let global = {
    camera: {position: new THREE.Vector3(0,15,160)},
    titles: [],
    cameraSnapPositions: [], //! remve new strategy camera fixed!  elements moves
    //middleSectionState: []
}

/** Canvas */
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
})

//todo: remove this
const changeCameraSnapPosition = ( arr ) => {
    global.cameraSnapPositions = [...arr]
}




const requestAnimationFrame =   window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame || 
                                window.webkitRequestAnimationFrame || 
                                window.msRequestAnimationFrame 

let element  = document.getElementById("movingDiv")
let start, previousTimeStamp
let done = false



//** import titels */ 
// ! **********************************************************************




















// ! **********************************************************************

let color = [
    0x00ff00,
    0xff66ff,
    0xffff00,
    0x0066ff,
    0xff0000,
    0x006666,
    0x9900ff,
    0x996633,
    0xff9933,
    0x00ffcc

] //! this is a moch 

let meshes = [] //! this is a moch : will be remplaced by fetch titles 

//todo obj
let scroll = 0  // state of the carousel 
let scrollTarget = 0    // state of the carousel 
let currentScroll = 0   // state of the carousel 


let number = 5 //! moch
let boxSize = 10 //! moch

let margin = 30 // state of the carousel  //!  propotional to windows widht
let wholeWidth = number*margin 


let positions = [] // state of the carousel 


let duration = 20 //! this is not duration this is the frame number per animation 
let frame = 0


let isAnimationStarted = false  // state of the carousel 

let sensitivityCoefficient = 1



let previousTouch
let touchStartEvent = () => {
    document.addEventListener("touchstart", ()=>{
        touchMoveEvent()
    })
}

let touchEndEvent = () => {
    document.addEventListener("touchend", ()=>{
        document.removeEventListener('touchstart',handleTouchMove)
        resetFrame()
        updateModelsPositionsOnScrolling()
        isAnimationStarted=true
    })
}


let touchMoveEvent = () => {
    scroll = 0
    scrollTarget = 0
    document.addEventListener("touchmove", handleTouchMove)
}




let handleTouchMove = (event) => {
    const touch = event.touches[0]
    if(previousTouch){
        event.movementX = (touch.pageX - previousTouch.pageX).toFixed(2)
        scrollTarget = event.movementX*0.5*sensitivityCoefficient
        currentScroll += scroll
        updateModelsPositionsOnScrolling()           
    }
    previousTouch = touch 
}


let touchEvent = () => {
    touchStartEvent()
    touchEndEvent()
}




let mouseDownEvent = () => {
    document.addEventListener("mousedown", () => {
        mouseMoveEvent()
    });
}

let mouseUpEvent = () => {
    document.addEventListener("mouseup", () => {
        document.removeEventListener('mousemove',handleMosueMove)
        resetFrame()
        updateModelsPositionsOnScrolling()
        isAnimationStarted=true
    })
}

let mouseMoveEvent = () => {
    scroll = 0
    scrollTarget = 0
    document.addEventListener("mousemove", handleMosueMove)
}


let handleMosueMove = (event) => {
    scrollTarget = event.movementX*0.2*sensitivityCoefficient
    currentScroll += scroll
    updateModelsPositionsOnScrolling()
}


let mouseEvent = () => {
    mouseDownEvent()
    mouseUpEvent()
}

let wheelStartEnvent = ( ) => {
    scroll = 0
    scrollTarget = 0
    document.addEventListener("wheel", (event)=>{
        scrollTarget = event.wheelDelta*0.1*sensitivityCoefficient
        currentScroll += scroll
        updateModelsPositionsOnScrolling()
    })
}

let wheelStopEvent = () => {
    createWheelStopListener(window, handleWheelStop)
}

let handleWheelStop = () => { 
    resetFrame()
    //updateModelsPositionsOnScrolling()
    isAnimationStarted=true
}

let  createWheelStopListener = (element, callback, timeout) => {
    let handle = null
    let onScroll = function() {
        if (handle) {
            clearTimeout(handle)
        }
        handle = setTimeout(callback, timeout || 300)
    }
    element.addEventListener('wheel', onScroll)
    return function() {

        element.removeEventListener('wheel', onScroll)
    }
}

let wheelEvent = () => {
    wheelStartEnvent()
    wheelStopEvent()
}


let createBox = (color) => {
    let geometry = new THREE.BoxGeometry( boxSize, boxSize, boxSize )
    let material = new THREE.MeshBasicMaterial( { color: color } )
    let mesh = new THREE.Mesh( geometry, material )
    return mesh
}

let distanceToTargetPosition = ( margin, currentScroll ) => {
    let value = 0
    if (isCloserToNext( currentScroll, margin )) {
        value = -(currentScroll%margin) - margin
    } else if (isCloserToPrevious( currentScroll, margin )) {
        value = -(currentScroll%margin) + margin
    } else {
        value = -(currentScroll%margin)
    }
    return value
}


let isCloserToNext = ( currentScroll, margin ) => {
    return -(currentScroll%margin) > (margin/2)
}

let isCloserToPrevious = ( currentScroll, margin ) => {
    return -(currentScroll%margin) < -(margin/2) 
}


let lagInCurrnetScroll = ( frame, duration, distance ) => {
    let isAnimationEnded = frame === duration
    return isAnimationEnded? distance: null
}


let updateModelsPositionsOnScrolling = () => {
    meshes.forEach(obj=>{
        obj.mesh.position.x = ( margin*obj.index + currentScroll + 64513*wholeWidth )%wholeWidth - 2*margin
        positions[obj.index] = obj.mesh.position.x 
    })
}

let updateModelsPositionsOnAnimation = ( meshes, frame, distance, duration ) => {
    let isAnimationOn = frame <= duration
    let arr = [...meshes]
    

    if(isAnimationOn) {
        arr.forEach(
            obj=>{ 
                obj.mesh.position.x = easeInOutQuint(frame,positions[obj.index],distance,duration) 
            }
        )
    }
    return arr
}


//! moch
let createMeshesArr = () => {
    for(let i = 0; i < number; i++ ) {
        let mesh = createBox(color[i])
        positions.push(0) // pos init 
        meshes.push({
            mesh,
            index: i
        })
        scene.add(mesh)
    }
}

let  resetFrame = () => {
    frame = 0
}



let scaleSections = (scale) => {
    meshes.forEach(
        obj=>{ 
            obj.mesh.scale.setX(scale)
        }
    )   
}


let curve = (pos ) => {
   return easeInOutSin(pos , 1 , .55 , 7)
}


let updateSensitivity = (pos) => {
    return easeInOutQuint(pos , .4 , 1 , 6)
}

let carousel = () => {
    mouseEvent()
    touchEvent()
    wheelEvent()
    createMeshesArr()//! moch
    updateModelsPositionsOnScrolling()
}

carousel()





function animation() {

   
    scroll += (scrollTarget - scroll)*0.5
    scroll = 0.5*scroll.toFixed(3)
    scrollTarget = 0.5*scrollTarget.toFixed(3)
    currentScroll += (scroll*0.01)


    console.log('scroll',scroll.toFixed(5),'  |  scrollTarget', scrollTarget.toFixed(5),  '  |  currentScroll', currentScroll.toFixed(3))
    
    frame += 1


    let position = Math.abs((meshes[0].mesh.position.x)%margin).toFixed(2) 
    sensitivityCoefficient=1.3

    if ( position <= 7 ) {
        scaleSections (curve(position).toFixed(5))
        sensitivityCoefficient = updateSensitivity(position)
    }

    if ( position >= margin - 7  ) {
        scaleSections (curve(margin-position).toFixed(5))
        sensitivityCoefficient = updateSensitivity(margin-position)
    }
    
    if(isAnimationStarted ) {
        let distance = distanceToTargetPosition( margin, currentScroll)
        meshes = updateModelsPositionsOnAnimation( meshes, frame, distance, duration )
        currentScroll += lagInCurrnetScroll( frame, duration, distance )//! + number of margin * margin 
        
    }
    if(frame===duration){
        isAnimationStarted = false
    }
    requestAnimationFrame(animation)
    renderer.render(scene, camera)
   

}

animation()



// ! **********************************************************************



//todo: this goes to services
// * array is a list of svg got from firestore (in dev !!! now !!!  we use a simple array)


//todo: this goes to services
// * arr is arr of urls  and names


//todo: this goes to utils
// * arra is array of raw svg from firebase storage and  names



// todo: this goes to lib for three js
// * arra is array of devided svg from firebase storage and  names




// todo: scale the middle section using the easeInOutQuad function

// // *
// const scaleMidleSection = ( SVGTitle , n ) => {

//     let middleSectionRange = new THREE.Box3().setFromObject( SVGTitle.materilizedSVG[1] )
//     let lastSectionRange = new THREE.Box3().setFromObject( SVGTitle.materilizedSVG[0] )

//     SVGTitle.materilizedSVG[1].scale.setX(n)
    
//     let newMiddleSectionRange = new THREE.Box3().setFromObject( SVGTitle.materilizedSVG[1] )


//     let translateMiddleSectionBy  = newMiddleSectionRange.min.x - middleSectionRange.min.x
//     // how much to translate midel section 
//     SVGTitle.materilizedSVG[1].translateX(-translateMiddleSectionBy)
//     let newestMiddleSectionRange = new THREE.Box3().setFromObject( SVGTitle.materilizedSVG[1] )
    
//     let translateLastSectionBy = newestMiddleSectionRange.max.x - lastSectionRange.min.x
//     // how much  to translate the last part
//     SVGTitle.materilizedSVG[0].translateX(translateLastSectionBy)
// }



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
//todo: this goes to json file or a js file in data folder for local dev env 
//todo add the env 


const getSVGPathForDev = (element) => { 
    return envermentStorage() + element.path
}

const getSVGsPathsForDev = () => {

}







const models = await getAssetsList(lists.models)
const titles = await getAssetsList(lists.titles)


// let a1 = await getRawTitles([{ name: titles[0].name, url: getSVGPathForDev(titles[0]) }])


// let a2 = await divideTitles(a1)

// let a3 = await materilizeTitles(a2)


// console.log(a3)
// a3[0].materilizedSVG[0].position.x  =(  currentScroll + 64513*wholeWidth )%wholeWidth - 2*margin

// a3[0].materilizedSVG[0].scale.set(1, 1, 10100)


// scene.add(a3[0].materilizedSVG[0])






console.log('models',models)
console.log('titles',titles)



const mySVGRef = ref( appStorage, 'SVGs/my-story.svg')
const mySVG = await fetchDownloadURL(mySVGRef)



// todo: this goes to features folder under carousel folder
// * this to abstract the process of get  the svg from firebase storage
const getTitles = async (obj) => { 
    const titles = await getTitelsList() // this function will need the the env type 



    const refs = await refrenceAssets(titlesList)
    console.log('refs',refs)

    const svgURLs = await  downloadURLs(refs) 
    console.log('svgURLs',svgURLs)


 //! fix URL for emulator and production 
    const rawTitles = await getRawTitles(svgURLs)
    console.log('rawTitles',rawTitles)
    


    const devidedTitles = await divideTitles(rawTitles)
    console.log('devidedTitles',devidedTitles)


    const materilizedTitles = await materilizeTitles(devidedTitles)
    console.log('materilizedTitles',materilizedTitles)
    return {
        ...obj,
        titles:materilizedTitles
    }
}

let ab = {}
//ab = await getTitles(ab)

//console.log( getTitelsList())


// global =  await myTitles(global) 


// console.log(global)
/** texture loader  */

/** Debug */
const size = 800
const divisions = 10
const gridHelper = new THREE.GridHelper( size, divisions )



// let cameraSnapPositions = []
// let titles = []
// console.log( titles )






/** Scene */




/** Materials */
// const darkMaterial = new THREE.MeshStandardMaterial({color:0x111111})
// const purpleMaterial = new THREE.MeshStandardMaterial({color:0x4d0099})
// const greenMaterial = new THREE.MeshStandardMaterial({color:0x00995c, side: THREE.DoubleSide})
// const orangeMaterial = new THREE.MeshStandardMaterial({color:0xb36b00, side: THREE.DoubleSide})

/** Mesh */




/** import icon example */ 



// //todo: move this to lib for three js , call back in the features folder under the name light function
// /** Lights */
// const pointLightWhite = new THREE.PointLight(0xffffff ,1, 100 )
// pointLightWhite.position.set(10, 10, 10)

// const pointLightGreen = new THREE.PointLight(0x00e68a, 1, 100 )
// pointLightGreen.position.set(20, -9, 0)

// const pointLightOrange = new THREE.PointLight(0xff5c33, 1, 100 )
// pointLightOrange.position.set(-4, -10, -20)

// const pointLightPurple = new THREE.PointLight(0xcc33ff, 1, 100 )
// pointLightPurple.position.set(30, 10, -20)

// const ambientLight = new THREE.AmbientLight(0xffffff)
// scene.add(ambientLight , pointLightWhite, pointLightGreen, pointLightPurple, pointLightOrange)


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

// window.addEventListener('resize', () =>{

//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// })
 


// //todo: move this to lib for three js or remove it in the new apprach
/** Camera */
    //Base camera
    //Controls
    
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.setZ(global.camera.position.z)
    camera.position.setY(global.camera.position.y)
    camera.position.setX(global.camera.position.x)
/** Renderer */




// //! ???
// let params = {
//     x: 0
// }

// let gui = new dat.GUI();

// gui.add(params, 'x', -50,400).step(1).onChange(function(value){
//         changeCameraX(value);
// }) 




// //todo: move this to utils folder
// function changeCameraX(value){
//     camera.position.x = value
// }


//todo: move this to lib
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

    // let i = 0
    // let j = 0
    // let k = 1
    // let x = 0
    // let y = 0
    // let executeOnce=false
    // let startScaleUp = false
    // let startScaleDown = false


    // // todo: remove this animation loop and use callback


    // const animate = () => {

    // }

    // function animateLoop() {


    //     requestAnimationFrame(animateLoop)

    
    //     renderer.render(scene, camera)
    //     i++
    //     //console.log(j)
    //     i === 400   ?   i=0 :   null
    //     i === 0     ?   j++ :   null
    //     //j === 4     ?   camera.position.setX( -100 ) : null
    //     j === 4     ?   j=0 :   null


    //     // todo abstract to function 
    //     camera.position.lerp(new THREE.Vector3(global.cameraSnapPositions[j],camera.position.y,camera.position.z),.02)

      
        


    //    // console.log(camera.position)
    //     // * when the animation starts : when the j changes when the i = 0
    //     if( global.titles.length!==0 && i===0 ){
    //         console.log('scale up') 
    //         k=1
    //         global.titles.forEach(element => {scaleMidleSection(element,1)})
    //         startScaleUp = true
    //         startScaleDown = false
    //     }  




    //     i===0 ?  executeOnce=true : null
        



    //     //! (i+1)/400) is not working
    //     // todo scale up to 1 in linear way

    //     //global.titles.forEach(element => {scaleMidleSection(element, 1.001)})
        

    //     //scaleMidleSection(global.titles[0], (i+1)/400)

    //     //global.titles.length!==0 ?  scaleMidleSection(global.titles[0], 1) : null


    //     // * when the animation ends : when  camera.position === is a const 
    //     // todo scale down to 0.01 in linear way

    //     // ! here go the scale function for the middle section
    //    // manageMiddleSection( j )
       

    //     if (i % 50 === 0) { 
    //         x = camera.position.x - camera.position.x % 1
    //     }
            
          
    //     if (i % 60 === 0) { 
    //         y =  camera.position.x - camera.position.x % 1
    //     }



    //     // console.log('x',x -(camera.position.x - camera.position.x % 1))
    //     // console.log('y',y -(camera.position.x - camera.position.x % 1))
    //     if(x -( camera.position.x - camera.position.x % 1)===0 && y -( camera.position.x - camera.position.x % 1 ) !== 0 && executeOnce){
           
    //         console.log('scale down')
    //         k=1
    //         startScaleUp=false
    //         startScaleDown = true
    //         executeOnce=false
    //     }



    //     if(startScaleUp) {
    //         k++
    //         if(k<=50){
    //             global.titles.length!==0 ?  global.titles.forEach(element => {scaleMidleSection(element,0.02*k)}) : null
    //         }
    //     }

    //     if(startScaleDown && k<=100) {
    //         k++
    //         global.titles.length!==0 ?  global.titles.forEach(element => {scaleMidleSection(element,/*-0.0002*k*k+1*/-0.01*k+1)}) : null
            
    //         // if(k>=50) {
    //         //     global.titles.length!==0 ?  global.titles.forEach(element => {scaleMidleSection(element,1/14900*(k*(1-k)+9900))}) : null
    //         // }
            
    //     }



         
    //         // console.log('x',x )
    //         // console.log('y',y )
    //         // console.log('camera',camera.position.x)
    
        
        

        

        
        
            

    //     // todo make illusion of infinty loop (how to do it when the new obj can be seen whit odl one)
    //     // * idea what if i teleport the first object to after the last one and then teleport it back with the camera to the beginning
    //     // * when we are at j 3 we teleport the obj0 to postion 4 
    //     // * when we are at j 4 we teleport the obj0  and the camera to postion 0 

        
        
    //     // lerpScaleMidleSection(titles[j],(i+1)/400)

    //     // todo call the midel scale down  function 
    //     // todo change color
    //     // todo add movement  to models around the title 
    //     // todo 










    // }
    // animateLoop()

    
/** Background */
// TODO: Add a function to change the background color with the scroll. 
scene.background = new THREE.Color( 0x808080 )



renderer.render(scene, camera)

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




// const fbxLoader = new FBXLoader()

// const myModelRef = ref( appStorage, 'letter.fbx')

// // todo abstract this to utils
// let targetEnverment = () => {
//     return  (process.env.NODE_ENV === "production" && location.hostname === "localhost") ? "emulator"
//         :   process.env.NODE_ENV
// }




// // todo : make conditions for the different envs (dev, prod, emulator)
// // todo we can change loadModel to be function that takes the url as an argument
// // TODO remove this finction 


// // todo: add the scene as argument to the function loadModel
// // todo: move this to lib folder
// const addObjToScene = ( url ) => {
//     fbxLoader.load( url, 
//         (object) => {
//             object.scale.set(.1, .1, .1)
//             scene.add(object)
//         },
//         (xhr) => {
//             console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//         },
//         (error) => {
//             console.log('error:', error)
//         }
//     )  
// }

// //todo: move this to data folder
// const myModelsInfoMoch = [
//     {name: "letter"},
//     {name: "HTML"},
// ]


// //todo: move this to data folder
// const mySVGsMoch = [ 
//     {
//         name: "my-story",
//         link: "svg/my-story.svg"
//     },
//     {
//         name: "my-work",
//         link: "svg/my-work.svg"
//     },
//     {
//         name: "reach-out",
//         link: "svg/reach-out.svg"
//     },
//     {
//         name: "buy-me-a-coffee",
//         link: "svg/buy-me-a-coffee.svg"
//     },
// ]



// TODO new data schema for firestore collection collection { name: "contact",  models [ array of modal gonna be used in contact component] } all files gonna be in the same folder 
 




// TODO refactor : abstract the env checking process to a function and move it to a diff drectory (env || config)S
// todo remove assets dir form git




//* this function adds the models to the scene in three diffrent ways for the different envs 
// // todo abstract it to a function in utils folder
// async () => {
//     // todo abstract this to a function
//     if (targetEnverment() === "emulator") {
//         connectStorageEmulator( myStorage, "localhost", 9199)
//         const modelURL = await fetchDownloadURL(myModelRef)
//         const model = await loadAsset(modelURL,FBXLoader) 
//         addModelToScene(model,scene)
//         // todo devide this funciton to two functions

//     }

//     if (targetEnverment() === "development") {
//         const url = envermentStorage( routes, targetEnverment ) +  myModelsInfoMoch[1].name + ".fbx"
//         addModelToScene(  await loadAsset(url,FBXLoader) ,scene )
//     }



//     if ( targetEnverment() === "production" ) {
//         const modelURL = await fetchDownloadURL(myModelRef)
//         const model = await loadAsset(modelURL, FBXLoader)
//         addModelToScene(model,scene)
//     }
// }




// // todo: emulator firestore
// // todo: create a fucntion that fetch all the colloections of the models from firestore
// // todo: create a function that takes as argument collection name and returns the array of models names
// // todo: create a function that takes as argument an array of models names and retuens an array of objcts with the mode name and the url of the model in the farebase storage
// // todo: create a function that takes as argument an array of objects and a postion function render all the models in the scene 
// // todo: craete a function that returns a random position
// // todo: ditch the random position and use only three or four models that turns => so create a function that retern positions 



// // // todo: function to loadobject 
// // // todo: function to add object to the scene
// // // todo: function for the positon 
// // // todo: function to scale models




// // // todo: create a function that takes as argumnet model ref and retuns download url





// //!--------------------------------------------------------------------------------------
// //todo: new approach : this should only load SVGs and  abstracted to utiltes or features
// //!--------------------------------------------------------------------------------------

// async function func () {
//     // todo abstract this to a function
//     if (targetEnverment() === "emulator") {
//         connectStorageEmulator( appStorage, "localhost", 9199)
//         //const SVGURL = await fetchDownloadURL(mySVGRef)
//         //loadAsset(SVGURL, SVGloader)
        
//     }

//     if (targetEnverment() === "development") {


//         //!-----------------------------------------------------
//         //todo: new approach : this should only load SVGs
//         //!-----------------------------------------------------

        // todo: to abstract
        // todo: create a new array with objects and the name
        // * to get  from the global
        //global = await myTitles(global)
        //let  myTitelsSVGs = global.titles

        // const myTitelsSVGs = await Promise.all(mySVGsMoch.map(async element => {
           
        //     const SVGURL = await envermentStorage( routes, targetEnverment ) + element.link


        //     const rawSVG = await loadAsset(SVGURL, SVGloader)

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


//         /** init */
//         let proprtion = {n: .01}
//         let arr = myTitelsSVGs[0]
//         titles = [...myTitelsSVGs]
//         const changeProprtion = (value) => {
//             {n: value}
//         }

//         // add the svg to the scene and scale middle section
//         for(let i = 0; i < myTitelsSVGs.length; i++) {
//             for ( let j = 0; j < 3; j++ ) {
//                 // todo change the 100 to be proprtional to the screen size
//                 myTitelsSVGs[i].materilizedSVG[j].position.setX(i*100)
//                // j === 1 ? myTitelsSVGs[i].materilizedSVG[1].scale.setX(proprtion.n) : null
//                 scene.add(myTitelsSVGs[i].materilizedSVG[j])
//             }
//         }

        

//         //  translate the midle section and the last section
//         // let box = new THREE.Box3().setFromObject( arr.materilizedSVG[1] )
//         // let box3 = new THREE.Box3().setFromObject( arr.materilizedSVG[2] )
//         // arr.materilizedSVG[1].translateX( (box.min.x-box3.min.x)/proprtion.n - box.min.x+box3.min.x) // how much to translate midel section 
//         // arr.materilizedSVG[0].translateX( -(box.max.x - box.min.x)*(1-proprtion.n)/proprtion.n )   // how much  to translate the last part 



//         //center camera on the model
//         let box1 = new THREE.Box3().setFromObject( arr.materilizedSVG[2] )
//         let box2 = new THREE.Box3().setFromObject( arr.materilizedSVG[0] )
//         camera.position.setX(  (box2.max.x+box1.min.x)/2)


//         // camera snap positions
//         cameraSnapPositions = myTitelsSVGs.map(
//             (element) => {  
//                 let box1 = new THREE.Box3().setFromObject( element.materilizedSVG[2] )
//                 let box2 = new THREE.Box3().setFromObject( element.materilizedSVG[0] )
//                 return  (box2.max.x+box1.min.x)/2
//             }
//         )
//         console.log(cameraSnapPositions)
        
//         global = {...global, cameraSnapPositions: [...cameraSnapPositions]}

       


//     }

 

//     if ( targetEnverment() === "production" ) {

//         const SVGURL = await fetchDownloadURL(mySVGRef)
//         //loadAsset(SVGURL,SVGloader)
//     }
// }


// const mySVGRef = ref( appStorage, 'about-me.svg')


// // ! 


// global =  await myTitles(global) 


// console.log(global)
// func ()



// // ! todo: refacto 
// // * global stuff : try redux approach the store
// // * camera position 
// // * title objects 
// // *  

// // todo: find the  best distence between the titels 
// // todo: chnage camera position for each screen size

// // todo: create funciton to change camera position : 1. by time 2. by nav bar link

// // ! solve  impure functions isues 

// // ! important  create three js carousel function that takes svgs and elements and add to the scene carousel  
// // * spec: 

// // ! important handle the waiting time  when loading ... all stuff use the xhr



// // * doc 
// // ? whaat 
// // normal 


// const manageMiddleSection = ( n ) => {

// }



// // //todo: move this to lib 
// // const centerCameraOnTitle = ( SVGTitle ) => {
// //     let firstSectionRange = new THREE.Box3().setFromObject( arr.materilizedSVG[0] )
// //     let lastSectionRange = new THREE.Box3().setFromObject( arr.materilizedSVG[2] )
// //     camera.position.setX(  (firstSectionRange.max.x + lastSectionRange.min.x)/2)
// // }




// // // todo make all middle section null 
// // global.titles.length!==0 ?  global.titles.forEach(element => {scaleMidleSection(element,.01)}) : null


// // global.titles.length!==0 ?  global.titles.forEach(element => {
// //     scaleMidleSection(element,.5)
    
// // }) : null



// //scaleMidleSection(global.titles[0], .01)



// // todo romove buy me coffee then 

// // todo grab to move 

// // todo rotate the titels so it looks vertical 


// // todo change the lerp function of the camera movement to a new the easy in easy out function


// //! todo rebuild the animation using window.requestAnimationFrame 
 




// // todo: loaders goes to lib 
// // todo: three js stuff goes to features
// // todo: annimation goes to features 
// // todo: fetch and load goes to services
// // todo: svg helpers and edit models goes to utils
// // todo: create 3D carousel and put it in the features
// // todo: create a carousel component and put it in the features



