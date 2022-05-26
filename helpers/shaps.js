import * as THREE from 'three'




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


export { boxWithRoundedEdges, cylinderWithroundedendge }