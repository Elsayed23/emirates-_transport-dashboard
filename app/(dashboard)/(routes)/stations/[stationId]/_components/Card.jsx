'use client'
import LanguageContext from '@/app/context/LanguageContext'
import useTranslation from '@/app/hooks/useTranslation'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const Card = ({
    id,
    idd,
    name,
    stationId,
    countOfStudents,
    countOfTrafficLines,
    translationName
}) => {
    const router = useRouter()

    const { language } = useContext(LanguageContext);

    const { t } = useTranslation()

    return (

        <div onClick={() => router.push(`/stations/${stationId}/school/${id}`)} className='shadow-lg border border-black hover:scale-[1.03] duration-200 text-[#111] flex flex-col items-center gap-3 rounded-sm cursor-pointer p-4'>
            <h1 className='font-bold text-2xl'>{idd + 1}</h1>
            <h2 className='text-lg font-semibold'>{language === 'ar' ? name : translationName}</h2>
            <div className="flex items-center gap-3">
                <span className='text-opacity-75 text-sm'>{t('Count of itineraries')}: {countOfTrafficLines ? countOfTrafficLines : 0}</span>
                |
                <span className='text-opacity-75 text-sm'>{t('Count of transfers')}: {countOfStudents ? countOfStudents : 0}</span>

            </div>
        </div>
    )
}

export default Card