import { routes } from '../router'
import envermentStorage from './enverment-storage-url'


//todo : create the firebase function and move it as interface to service
const titelsURLs = async (arr) => {
    return await Promise.all(arr.map(async element => {
        const SVGURL=  await envermentStorage( routes ) + element.link
        return { name: element.name, svgLink: SVGURL }
    }))
}

export default titelsURLs