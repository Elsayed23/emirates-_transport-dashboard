'use client'
import useTranslation from '@/app/hooks/useTranslation'
import { useRouter } from 'next/navigation'
import React from 'react'

const StationCard = ({
    id,
    name,
    count,
    translationName
}) => {

    const router = useRouter()


    const { t } = useTranslation()


    return (

        <div onClick={() => router.push(`/stations/${id}`)} className='border shadow-lg hover:scale-[1.03] duration-200 text-[#111] flex flex-col items-center gap-3 rounded-sm cursor-pointer p-4'>
            <h1 className='font-bold text-2xl'>{id}</h1>
            <h2 className='text-lg font-semibold'>{t(`stationsData.${translationName}`)}</h2>
            <span className='text-opacity-75 text-sm'>{t('count of existing schools')} ({count})</span>
        </div>
    )
}

export default StationCard