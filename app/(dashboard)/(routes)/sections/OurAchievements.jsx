'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaPerson, FaRoad } from "react-icons/fa6";
import Card from '../_components/Card'
import { stationsData } from '@/app/constants';
import Loading from '../../_components/Loading';
import { FaSchoolFlag } from "react-icons/fa6";


const OurAchievements = () => {

    const [loading, setLoading] = useState(true)

    const [countsData, setCountsData] = useState({
        trafficLinesCount: 0,
        countOfStudents: 0,
        schoolsCount: 0
    })

    const getData = async () => {
        try {
            const trafficLines = await axios.get("/api/traffic_line/all")
            const schools = await axios.get("/api/school/count")

            const { trafficLinesCount, countOfStudents } = trafficLines.data
            const { schoolsCount } = schools.data

            setCountsData({
                trafficLinesCount,
                countOfStudents,
                schoolsCount
            })
            setLoading(false)
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getData()
    }, [])

    const cardsData = [
        {
            icon: <FaPerson size={30} />,
            title: 'Count of transferred students',
            data: countsData.countOfStudents || 0
        },
        {
            icon: <FaRoad size={30} />,
            title: 'Count of itineraries',
            data: countsData.trafficLinesCount || 0
        },
        {
            icon: <FaSchoolFlag size={30} />,
            title: 'Count of schools',
            data: countsData.schoolsCount || 0
        },
    ]

    const cards = cardsData?.map((data, idx) => {
        return (
            <Card key={idx} {...data} />
        )
    })

    if (loading) return <Loading />


    return (
        <div className='py-16'>
            <div className="container mx-auto">
                <div className="grid grid-cols-3 gap-6">
                    {cards}
                </div>
            </div>
        </div>
    )
}

export default OurAchievements