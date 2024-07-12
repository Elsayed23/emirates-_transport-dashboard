import { stationsData } from '../constants'

const getTrafficLinesOfSchool = (stationId, schoolId) => {
    const trafficLinesData = stationsData.filter(({ id }) => id === Number(stationId))
    [0].schools.filter(({ id }) => id === Number(schoolId))[0]


    return {
        ...trafficLinesData
    }
}


export default getTrafficLinesOfSchool