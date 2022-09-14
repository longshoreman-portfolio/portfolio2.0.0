import { ENV_CONST } from '../data/env'

let targetEnverment = () => {
    return  (process.env.NODE_ENV === ENV_CONST.pord && location.hostname === "localhost") ? ENV_CONST.emu :   process.env.NODE_ENV
}
export default targetEnverment