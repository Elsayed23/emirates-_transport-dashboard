import { stationsData } from '../constants'

const getStationSchools = (stationId) => {
    const schoolsData = stationsData.filter(({ id }) => id === Number(stationId))
    [0]

    return {
        ...schoolsData
    }
}


export default getStationSchools