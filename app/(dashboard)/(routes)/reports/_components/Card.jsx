'use client'
import useTranslation from '@/app/hooks/useTranslation'
import { useRouter } from 'next/navigation'
import React from 'react'

const Card = ({
    id,
    name,
    nameOfStation,
    nameOfSchool
}) => {


    const router = useRouter()
    const { t } = useTranslation()


    return (
        <div onClick={() => router.push(`/reports/${id}`)} className='border shadow-lg hover:scale-[1.03] duration-200 text-[#111] flex flex-col items-center gap-3 rounded-sm cursor-pointer p-4'>
            {/* <h1 className='font-bold text-2xl'>{name}</h1> */}
            <h2>{t('station')} {t(`stationsData.${nameOfStation}`)}</h2>
            <h2>مدرسة {nameOfSchool}</h2>
        </div>
    )
}

export default Card