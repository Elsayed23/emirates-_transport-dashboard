'use client'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import useTranslation from '@/app/hooks/useTranslation'
import LanguageContext from '@/app/context/LanguageContext'

const StationCard = ({
    id,
    count,
    color,
    name,
    educationalLevel,
    countOfStudents,
    transferredCategory,
    stationId,
    schoolId,
    createdAt
}) => {

    const riskColor = color === 1 || color === 2 ? 'bg-yellow-600' : color === 3 || color === 4 ? 'bg-red-800' : 'bg-slate-400'


    const router = useRouter()

    const { t } = useTranslation()
    const { language } = useContext(LanguageContext);

    return (

        <div onClick={() => router.push(`/stations/${stationId}/school/${schoolId}/trafiicLine/${id}`)} className='flex border shadow-lg hover:scale-[1.03] duration-200 relative text-[#111] flex-col gap-3 rounded-xl cursor-pointer px-4 py-5'>

            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={`w-4 h-4 rounded-full absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-4 cursor-default ${riskColor}`}></div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{riskColor === 'bg-red-800' ? t('Risk level: high') : riskColor === 'bg-yellow-600' ? t('Danger degree: moderate') : t('Degree of danger: normal')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <h1 className='font-bold text-2xl text-center'>{count}</h1>
            <h2 className='text-lg font-semibold text-center'>{name}</h2>
            {
                language === 'ar'
                    ?
                    <div className="flex items-center justify-center gap-3">
                        <span>{t('Count of transfers')}: <span className='font-bold'>{countOfStudents}</span></span>
                        |
                        <span>{t('educationalLevel')}: <span className='font-bold'>{t(educationalLevel)}</span></span>
                        |
                        <span>{t('transferredCategory')}: <span className='font-bold'>{t(transferredCategory)}</span></span>
                    </div>
                    :
                    <div className="flex flex-col gap-3">
                        <span>{t('Count of transfers')}: <span className='font-bold'>{countOfStudents}</span></span>
                        <span>{t('educationalLevel')}: <span className='font-bold'>{t(educationalLevel)}</span></span>
                        <span>{t('transferredCategory')}: <span className='font-bold'>{t(transferredCategory)}</span></span>
                    </div>
            }

            <span className='text-opacity-75 text-center text-sm'>{t('Date created')}: {new Date(createdAt).toLocaleDateString()}</span>
        </div>
    )
}

export default StationCard