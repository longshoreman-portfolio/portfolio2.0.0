import { getDownloadURL } from "firebase/storage";

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const storageURL = ( URLs, targetEnverment ) => { 
    return  targetEnverment() === "production" ? URLs.production //production storage
        :   targetEnverment() === "emulator" ? URLs.emulator //emulator storage
        :   targetEnverment() === "development" ? URLs.development //directory storage
        :   console.error("Error: no target enverment found")
}

// todo this has to become fetchModelURL
const getURLAndDownloadModel = (myModelRef , loadModel) => {
    getDownloadURL(myModelRef)
        .then((url) => {
            loadModel(url)
        })
        .catch((error) => {
            console.error('myError:',error)
            switch (error.code) {
                case 'storage/unknown':
                    console.error('An unknown error occurred.')
                    break;
                case 'storage/object-not-found':
                    console.error('No object exists at the desired reference.')
                    break;
                case 'bucket-not-found':
                    console.error('No bucket is configured for Cloud Storage')
                    break;
                case 'storage/project-not-found':
                    console.error('No project is configured for Cloud Storage')
                    break;
                case 'storage/quota-exceeded':
                    console.error("Quota on your Cloud Storage bucket has been exceeded. If you're on the no-cost tier, upgrade to a paid plan. If you're on a paid plan, reach out to Firebase support.")
                    break;
                case 'storage/unauthenticated':
                    console.error('User is unauthenticated, please authenticate and try again.')
                    break;
                case 'storage/unauthorized':
                    console.error('User is not authorized to perform the desired action, check your security rules to ensure they are correct.')
                    break;
                case 'storage/retry-limit-exceeded':
                    console.error('	The maximum time limit on an operation (upload, download, delete, etc.) has been excceded. Try uploading again.')
                    break;
                case 'storage/invalid-checksum':
                    console.error('	File on the client does not match the checksum of the file received by the server. Try uploading again.')
                    break;
                case 'storage/canceled':
                    console.error('	User canceled the operation.')
                    break;
                case 'storage/invalid-event-name':
                    console.error('Invalid event name provided. Must be one of [`running`, `progress`, `pause`].')
                    break;
                case 'storage/invalid-url':
                    console.error('Invalid URL provided to refFromURL(). Must be of the form: gs://bucket/object or https://firebasestorage.googleapis.com/v0/b/bucket/o/object?token=<TOKEN>.')
                    break;
                case 'storage/invalid-argument':
                    console.error('	The argument passed to put() must be `File`, `Blob`, or `UInt8` Array. The argument passed to putString() must be a raw, `Base64`, or `Base64URL` string.')
                    break;
                case 'storage/no-default-bucket':
                    console.error("No bucket has been set in your config's storageBucket property.")
                    break;
                case 'storage/cannot-slice-blob':
                    console.error("Commonly occurs when the local file has changed (deleted, saved again, etc.). Try uploading again after verifying that the file hasn't changed.")
                    break;
                case 'storage/server-file-wrong-size':
                    console.error("	File on the client does not match the size of the file recieved by the server. Try uploading again.")
                    break;
            }
        })
}


//todo to be used later in the new algo 
//todo add position as argument

function addModelToScene( object, scene ) {
    object.scale.set(.1, .1, .1)
    scene.add(object)
}


function setScale( object, scale ) {
    return object.scale.set(scale, scale, scale)
}



async function loadModel ( url ) {
    const fbxLoader = new FBXLoader()
    const result = await fbxLoader.loadAsync( url, 
        (object) => {
            return object
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log('error:', error)
        }
    )  
    return result
}


async function fetchDownloadURL(ref) {
    return await getDownloadURL(ref)
        .then((url) => {
            return url
        })
        .catch((error) => {
            console.error('myError:',error)
            switch (error.code) {
                case 'storage/unknown':
                    console.error('An unknown error occurred.')
                    break;
                case 'storage/object-not-found':
                    console.error('No object exists at the desired reference.')
                    break;
                case 'bucket-not-found':
                    console.error('No bucket is configured for Cloud Storage')
                    break;
                case 'storage/project-not-found':
                    console.error('No project is configured for Cloud Storage')
                    break;
                case 'storage/quota-exceeded':
                    console.error("Quota on your Cloud Storage bucket has been exceeded. If you're on the no-cost tier, upgrade to a paid plan. If you're on a paid plan, reach out to Firebase support.")
                    break;
                case 'storage/unauthenticated':
                    console.error('User is unauthenticated, please authenticate and try again.')
                    break;
                case 'storage/unauthorized':
                    console.error('User is not authorized to perform the desired action, check your security rules to ensure they are correct.')
                    break;
                case 'storage/retry-limit-exceeded':
                    console.error('	The maximum time limit on an operation (upload, download, delete, etc.) has been excceded. Try uploading again.')
                    break;
                case 'storage/invalid-checksum':
                    console.error('	File on the client does not match the checksum of the file received by the server. Try uploading again.')
                    break;
                case 'storage/canceled':
                    console.error('	User canceled the operation.')
                    break;
                case 'storage/invalid-event-name':
                    console.error('Invalid event name provided. Must be one of [`running`, `progress`, `pause`].')
                    break;
                case 'storage/invalid-url':
                    console.error('Invalid URL provided to refFromURL(). Must be of the form: gs://bucket/object or https://firebasestorage.googleapis.com/v0/b/bucket/o/object?token=<TOKEN>.')
                    break;
                case 'storage/invalid-argument':
                    console.error('	The argument passed to put() must be `File`, `Blob`, or `UInt8` Array. The argument passed to putString() must be a raw, `Base64`, or `Base64URL` string.')
                    break;
                case 'storage/no-default-bucket':
                    console.error("No bucket has been set in your config's storageBucket property.")
                    break;
                case 'storage/cannot-slice-blob':
                    console.error("Commonly occurs when the local file has changed (deleted, saved again, etc.). Try uploading again after verifying that the file hasn't changed.")
                    break;
                case 'storage/server-file-wrong-size':
                    console.error("	File on the client does not match the size of the file recieved by the server. Try uploading again.")
                    break;
            }
        })
}


export { storageURL, getURLAndDownloadModel, fetchDownloadURL, loadModel, addModelToScene }