import { db }  from '../../firebase-config.js'

import { getDocs, collection } from "firebase/firestore"

let fetchAllDocs = async ( col ) => {
    const querySnapshot = await getDocs(collection(db, col))
    let array = querySnapshot.docs.map((doc)=> {
       return doc.data()
    })
    return array
}

export default fetchAllDocs