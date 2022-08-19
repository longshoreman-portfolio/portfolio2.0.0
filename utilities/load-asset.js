export default async function loadAsset( url, loader ) { 
    const result = await loader.loadAsync(
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