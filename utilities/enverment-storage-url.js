import targetEnverment from './target-enverment'
import { routes } from '../router' 

let storageURL = ( ) => { 
    return  targetEnverment() === "production" ? routes.production
        :   targetEnverment() === "emulator" ? routes.emulator
        :   targetEnverment() === "development" ? routes.development
        :   console.error("Error: target enverment out of scope")
}

export default storageURL