import splitObject from './split-object.js'

let devideTitles = async (arr) => {
    return  await Promise.all(arr.map(async element => {
        const devidedSVG = splitObject(element.rawSVG)
        return { name: element.name, devidedSVG: devidedSVG }
    }))
}

export default devideTitles