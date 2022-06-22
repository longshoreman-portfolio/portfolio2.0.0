export default function splitObject (obj) { 
    const arr = []
    for ( let i = 0; i < obj.paths.length; i++ ) {
        arr[i] = { paths: [obj.paths[i]], xml:obj.xml }
    } 
    return arr
}