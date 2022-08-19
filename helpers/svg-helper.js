import * as THREE from 'three'


//! moved to new location 
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

// todo: scale down the mid section on of the text : 1- when camera modeved OR 2- when the models moved


export { materilizeSVG }