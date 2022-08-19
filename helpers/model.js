import { getDownloadURL } from "firebase/storage";

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'


// // todo this has to become fetchModelURL




//todo to be used later in the new algo 
//todo add position as argument
//todo make it proprtional to the screen size
//todo make it proprtional to camera distance || position



//!----------------------------------------------------------
//todo: abstract this to a new file for threeJs in lib folder
//!----------------------------------------------------------

// todo: to take position and scale as arguments
function addModelToScene( object, scene ) {

    const width = window.innerWidth
    const w = parseInt(width, 10)
    let x = w  * 0.04

    const height = window.innerHeight
    const h = parseInt(height, 10)
    let z = h * 0.04

    object.scale.set(.1, .1, .1)
    object.position.set( x , z, 0)
    scene.add(object)
}

//todo: this goes to lib for three js 
function addToScene( object, scene ) {
    scene.add(object)
}





// todo: find relations between three js scale and window.innerWidth and window.innerHeight





export { storageURL, addModelToScene, addToScene }