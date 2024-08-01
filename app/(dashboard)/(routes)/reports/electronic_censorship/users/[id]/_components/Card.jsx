'use client'
import useTranslation from '@/app/hooks/useTranslation'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import LanguageContext from '@/app/context/LanguageContext'

const Card = ({
    id,
    nameOfStation,
    nameOfSchool,
    approved,
    inspectionType,
    createdAt
}) => {


    const router = useRouter()
    const { t } = useTranslation()

    const { language } = useContext(LanguageContext)

    return (
        <div onClick={() => router.push(`/reports/${id}`)} className='border shadow-lg hover:scale-[1.03] duration-200 text-[#111] flex flex-col items-center gap-3 rounded-sm cursor-pointer p-4'>
            <span className='text-lg font-bold'>{!approved ? `(${t('Not approved')})` : `(${t('Approved')})`}</span>
            <h2>{t('station')}- {t(`stationsData.${nameOfStation}`)}</h2>
            <h2>{t('school')}- {nameOfSchool}</h2>
            <h2>{t('type')}- {t(inspectionType.name)}</h2>
            <h2>{t('Date created')} {new Date(createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', })}</h2>
        </div>
    )
}

export default Card