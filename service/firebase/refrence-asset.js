import { ref } from 'firebase/storage'

import { appStorage }  from '../../firebase-config'

const refAsset = (path) => {
    return ref( appStorage, path )
}

export default refAsset