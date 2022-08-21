export default async function loadAsset( url, loader ) { 
    let thisLoader = new loader
    const result = await thisLoader.loadAsync(
        url,
        ( data ) => {
            return data
        },
        ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
        },
        ( error ) => {
            console.error( 'An error happened:', error )
        }
    )
    return result
}