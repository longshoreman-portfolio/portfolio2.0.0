export default function storageURL ( URLs, targetEnverment ) { 
    return  targetEnverment() === "production" ? URLs.production //production storage
        :   targetEnverment() === "emulator" ? URLs.emulator //emulator storage
        :   targetEnverment() === "development" ? URLs.development //directory storage
        :   console.error("Error: target enverment out of scope")
}