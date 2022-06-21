import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import * as THREE from 'three'

async function loadSVG(url) { 
    const loader = new SVGLoader()
    const result = await loader.loadAsync(
        url,
        ( data ) => {
            return data
        },
        ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
        },
        ( error ) => {
            console.log( 'An error happened:', error )
        }
    )
    console.log('raw svg', result)
    return result
}


function materilizeSVG(svg) {
    const group = new THREE.Group()
    const paths = svg.paths
    for ( let i = 0; i < paths.length; i ++ ) {
        const path = paths[ i ]

        const material = new THREE.MeshBasicMaterial( {
            color: path.color,
            side: THREE.DoubleSide,
            depthWrite: false
        } );

        const shapes = SVGLoader.createShapes( path )

        for ( let j = 0; j < shapes.length; j ++ ) {
            const shape = shapes[ j ]
            const geometry = new THREE.ShapeGeometry( shape )
            const mesh = new THREE.Mesh( geometry, material )
            group.add( mesh )

        }

    }
    return group
} 
// // todo: create a function that takes an object of array and return array of objects 
function splitObject (obj) { 
    const arr = []
    for ( let i = 0; i < obj.paths.length; i++ ) {
        arr[i] = { paths: [obj.paths[i]], xml:obj.xml }
    } 
    return arr
}

// todo: scale down the mid section on of the text : 1- when camera modeved OR 2- when the models moved


export { loadSVG, materilizeSVG, splitObject }