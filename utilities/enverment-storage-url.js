import targetEnverment from './target-enverment'

let storageURL = ( URLs ) => { 
    return  targetEnverment() === "production" ? URLs.production
        :   targetEnverment() === "emulator" ? URLs.emulator
        :   targetEnverment() === "development" ? URLs.development
        :   console.error("Error: target enverment out of scope")
}

export default storageURL