import { stationsData } from '../constants'

const getRriksFromTrafficLine = (stationId, schoolId, trafficLineId) => {
    const RisksData = stationsData.filter(({ id }) => id === Number(stationId))
    [0].schools.filter(({ id }) => id === Number(schoolId))[0]?.trafficLines.filter(({ id }) => id === Number(trafficLineId))[0]?.risks


    return RisksData
}


export default getRriksFromTrafficLine