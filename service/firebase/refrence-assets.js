import refrenceAsset from './refrence-asset.js'

let refrenceAssets = async (arr) => {
    return await Promise.all(arr.map( async element => {
        const url = await refrenceAsset(element.path)
        return { name: element.name, ref: url }
    })) 
}

export default refrenceAssets