import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import * as THREE from 'three'

async function loadSVG(url) { 
    const loader = new SVGLoader()
    const result = await loader.loadAsync(
        // resource URL
        url,
        // called when the resource is loaded
        ( data ) => {
            return data
        },
        // called when loading is in progresses
        ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
        },
        // called when loading has errors
        ( error ) => {
            console.log( 'An error happened:',error )
        }
    )
    console.log('result:', result)
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



export { loadSVG, materilizeSVG }