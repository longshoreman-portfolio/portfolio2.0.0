import { lists } from '../../data/lists'

import { ENV_CONST } from '../../data/env'

import { titlesList } from '../../data/titles-list'

import { modelsList } from '../../data/models-list'

import targetEnverment from '../../utilities/target-enverment'


let getAssetsList = async (listName) => {
    if(targetEnverment()=== ENV_CONST.prod){
        return await fetchAllDocs(listName)
    }else if(targetEnverment()=== ENV_CONST.dev) {
        return listName===lists.titles?titlesList:modelsList
    }else if(targetEnverment()=== ENV_CONST.emy) {
        // * Using the same as the prod because the data set is already constructed.
        return await fetchAllDocs(listName)
    }
}

export default getAssetsList