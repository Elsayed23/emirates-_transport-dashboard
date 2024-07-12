'use client'
import React from 'react'
import { stationsData } from '@/app/constants'
import Card from './_components/Card'
import DynamicBreadcrumb from '../../_components/DynamicBreadcrumb'
import useTranslation from '@/app/hooks/useTranslation'

const page = () => {

    const stations = stationsData.map((station, idx) => <Card key={idx} {...station} count={station.schools.length} />)


    const { t } = useTranslation()

    const breadcrumbData = [
        {
            title: t('stations')
        }
    ]


    return (
        <div className="p-6 min-h-[calc(100vh-80px)] duration-300">
            <div className="flex flex-col gap-9">
                <DynamicBreadcrumb routes={breadcrumbData} />
                <div className='flex flex-col gap-3'>
                    <h2 className='text-xl font-semibold'>{t('results')}: {stations.length}</h2>
                    <div className="grid grid-cols-3 gap-6">
                        {stations}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page