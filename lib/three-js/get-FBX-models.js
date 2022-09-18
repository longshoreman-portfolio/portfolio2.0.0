import loadAsset from '../../utilities/load-asset'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

let getFBXModels = async ( arr ) => {
    return await Promise.all(arr.map( async element => {
        const FBXmodel = await loadAsset(element.modelLink, FBXLoader)
        return { name: element.name, model: FBXmodel }
    })) 
}

export default getFBXModels