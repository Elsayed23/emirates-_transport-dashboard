'use client'
import LanguageContext from '@/app/context/LanguageContext'
import useTranslation from '@/app/hooks/useTranslation'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'

const StationCard = ({
    id,
    count,
    name,
    _count,
    translationName
}) => {
    // { schools, TrafficLine }
    const router = useRouter()

    const { t } = useTranslation()

    const { language } = useContext(LanguageContext)

    console.log(language);


    return (

        <div onClick={() => router.push(`/stations/${id}`)} className='border shadow-lg hover:scale-[1.03] duration-200 text-[#111] flex flex-col items-center gap-3 rounded-sm cursor-pointer p-4'>
            {count && <h1 className='font-bold text-2xl'>{count}</h1>}
            <h2 className='text-lg font-semibold'>{language === 'ar' ? name : translationName}</h2>
            <span className='text-opacity-75 text-sm'>{t('count of existing schools')} ({_count?.schools || 0})</span>
            <span className='text-opacity-75 text-sm'>عدد خطوط السير ({_count?.TrafficLine || 0})</span>
        </div>
    )
}

export default StationCard