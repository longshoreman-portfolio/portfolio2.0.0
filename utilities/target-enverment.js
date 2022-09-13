let targetEnverment = () => {
    return  (process.env.NODE_ENV === "production" && location.hostname === "localhost") ? "emulator":   process.env.NODE_ENV
}
export default targetEnverment