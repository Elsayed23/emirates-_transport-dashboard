import axios from 'axios'
import { stationsData } from '../constants'

export const getSpecificSchoolName = (stationId, schoolId) => {
    const { name, translationName } = stationsData.filter(({ id }) => id === Number(stationId))[0]?.schools.filter(({ id }) => id === Number(schoolId))[0]



    return {
        arSchoolName: name,
        enSchoolName: translationName
    }
}


export const getSpecificStationName = (stationId) => {
    const { name, translationName } = stationsData.filter(({ id }) => id === Number(stationId))[0]



    return {
        arStationName: name,
        enStationName: translationName
    }
}

export const getSpecificTrafficLineName = async (id) => {


    const { data } = await axios.get(`/api/traffic_line/${id}`)


    const trafficLineName = data?.name


    return trafficLineName
}


