import axios from 'axios'
import { stationsData } from '../constants'

export const getSpecificSchoolName = (stationId, schoolId) => {
    const { name, translationName } = stationsData.filter(({ id }) => id === Number(stationId))[0]?.schools.filter(({ id }) => id === Number(schoolId))[0]



    return {
        arSchoolName: name,
        enSchoolName: translationName
    }
}


export const getSpecificTrafficLineData = async (id) => {


    const { data } = await axios.get(`/api/traffic_line/${id}`)


    return data
}


