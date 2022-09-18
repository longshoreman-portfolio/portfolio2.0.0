import fetchDownloadURL from './fetch-download-url.js'

let downloadURLs = async (arr) => {
    return await Promise.all(arr.map( async element => {
        const url = await fetchDownloadURL(element.ref)
        return { name: element.name, url: url }
    })) 
}

export default downloadURLs