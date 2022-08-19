import * as THREE from 'three'

export default function materilizeSVG(svg) {
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