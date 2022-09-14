import loadAsset from './load-asset'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

let getRawTitles = async ( arr ) => {
    return await Promise.all(arr.map( async element => {
        const rawSVG = await loadAsset(element.svgLink, SVGLoader)
        return { name: element.name, rawSVG: rawSVG }
    })) 
}

export default getRawTitles