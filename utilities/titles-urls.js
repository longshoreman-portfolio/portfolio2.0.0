import { routes } from '../router'
import envermentStorage from './enverment-storage-url'


//! this will only works on dev mode !!! 
//! we need to add ref function to ref all the array !!!
const titelsURLs = async (arr) => {
    return await Promise.all(arr.map(async element => {
        const SVGURL=  await envermentStorage( routes ) + element.link
        return { name: element.name, svgLink: SVGURL }
    }))
}

export default titelsURLs