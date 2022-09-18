import materilizeSVG from '../lib/three-js/materilize-SVG.js'

let materilizeTitles = async (arr) => {
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

export default materilizeTitles