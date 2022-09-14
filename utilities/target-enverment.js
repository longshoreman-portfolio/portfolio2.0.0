import { ENV_CONST } from '../data/env'

let targetEnverment = () => {
    return  (process.env.NODE_ENV === env.pord && location.hostname === "localhost") ? env.emu :   process.env.NODE_ENV
}
export default targetEnverment