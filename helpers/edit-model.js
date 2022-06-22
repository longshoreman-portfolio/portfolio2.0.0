function setScale( object, scale ) {
    return object.scale.set(scale, scale, scale)
}

function setPosition( object, position ) {
    return object.position.set(position.x, position.y, position.z)
}

function setAngle( object , angle ) {
}


export { setPosition, setAngle, setScale  }
