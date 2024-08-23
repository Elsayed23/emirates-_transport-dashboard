'use client'
import React, { useEffect, useState } from 'react'
import { stationsData } from '@/app/constants'
import Card from './_components/Card'
import DynamicBreadcrumb from '../../_components/DynamicBreadcrumb'
import useTranslation from '@/app/hooks/useTranslation'
import { useAuth } from '@/app/context/AuthContext'
import Loading from '../../_components/Loading'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {

    const { user } = useAuth()

    const [stations, setStations] = useState(null)
    const [loading, setLoading] = useState(true)

    const getStations = async () => {
        try {

            const { data } = await axios.get('/api/station')
            setStations(data)
            console.log(data);

            setLoading(false)

        } catch (error) {
            console.log(error);
        }
    }


    const filteredStation = stations?.find(({ id }) => id === user?.stationId)

    useEffect(() => {
        getStations()
    }, [])

    const { t } = useTranslation()

    const breadcrumbData = [
        {
            title: t('stations')
        }
    ]

    if (!user || loading) {
        return <Loading />
    }

    return (
        <div className="p-6 min-h-[calc(100vh-80px)] duration-300">
            <div className="flex flex-col gap-9">
                <DynamicBreadcrumb routes={breadcrumbData} />
                {
                    user?.role?.name === 'ADMIN'
                    &&
                    <Link href='/stations/add'>
                        <Button className='self-start'>إضافة محطة</Button>
                    </Link>
                }
                <div className='flex flex-col gap-3'>
                    {/* <h2 className='text-xl font-semibold'>{t('results')}: {station.length}</h2> */}
                    <div className="grid grid-cols-3 gap-6">
                        {
                            user?.role?.name !== 'OPERATIONS_MANAGER'
                                ?
                                stations?.map((station, idx) => <Card count={idx + 1} key={idx} {...station} />)
                                :
                                <Card {...filteredStation} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page