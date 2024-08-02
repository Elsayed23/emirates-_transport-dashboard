import { stationsData } from '../constants'

const getTrafficLinesOfSchool = (stationId, schoolId) => {
    const trafficLinesData = stationsData.filter(({ id }) => id === String(stationId))
    [0]?.schools.filter(({ id }) => id === String(schoolId))[0]


    return {
        ...trafficLinesData
    }
}


export default getTrafficLinesOfSchool