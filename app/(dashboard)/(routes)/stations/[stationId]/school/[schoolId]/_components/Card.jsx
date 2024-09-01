'use client'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import useTranslation from '@/app/hooks/useTranslation'
import LanguageContext from '@/app/context/LanguageContext'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FaXmark } from 'react-icons/fa6'
import { useAuth } from '@/app/context/AuthContext'

const StationCard = ({
    id,
    userId,
    userName,
    color,
    name,
    educationalLevel,
    countOfStudents,
    transferredCategory,
    handleDeleteTrafficLine,
    stationId,
    schoolId,
    createdAt
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const riskColor = color === 1 || color === 2 ? 'bg-yellow-600' : color === 3 || color === 4 ? 'bg-red-800' : 'bg-slate-400'
    const router = useRouter()
    const { t } = useTranslation()
    const { language } = useContext(LanguageContext);

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setIsDialogOpen(true);
    }

    const confirmDelete = (e) => {
        e.stopPropagation();
        handleDeleteTrafficLine(id);
        setIsDialogOpen(false);
    }

    const main = useAuth()

    const handleCancelClick = (e) => {
        e.stopPropagation();
        setIsDialogOpen(false);
    }

    const handleDialogClick = (e) => {
        e.stopPropagation();
    }
    console.log(userId, main?.user?.id);

    return (
        <div onClick={() => router.push(`/stations/${stationId}/school/${schoolId}/trafficLine/${id}`)} className='flex border shadow-lg hover:scale-[1.03] duration-200 relative text-[#111] flex-col gap-3 rounded-xl cursor-pointer px-4 py-5'>
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
            <h2 className='text-2xl font-semibold text-center'>{name}</h2>
            {
                language === 'ar'
                    ?
                    <div className="flex items-center justify-center gap-3">
                        <p>{t('Count of transfers')}: <span className='font-bold'>{countOfStudents}</span></p>
                        |
                        <p>{t('educationalLevel')}: <span className='font-bold'>{t(educationalLevel)}</span></p>
                        |
                        <p>{t('transferredCategory')}: <span className='font-bold'>{t(transferredCategory)}</span></p>
                    </div>
                    :
                    <div className="flex flex-col gap-3">
                        <p>{t('Count of transfers')}: <span className='font-bold'>{countOfStudents}</span></p>
                        <p>{t('educationalLevel')}: <span className='font-bold'>{t(educationalLevel)}</span></p>
                        <p>{t('transferredCategory')}: <span className='font-bold'>{t(transferredCategory)}</span></p>
                    </div>
            }
            <p className='text-opacity-75 text-center text-sm'>{t('Date created')}: {new Date(createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', })}</p>
            <p>{t('Inspector')}: <span className='font-semibold'>{userName}</span></p>
            {
                main?.user?.id === userId || main?.user?.role?.name === 'ADMIN'
                    ?
                    <div className="absolute top-2 right-2">
                        <Button variant='destructive' size='icon' className='self-start rounded-full w-8 h-8' onClick={handleDeleteClick}>
                            <FaXmark size={18} />
                        </Button>
                    </div>
                    :
                    null

            }
            {isDialogOpen && (
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <div onClick={handleDialogClick}>
                        <AlertDialogContent>
                            <AlertDialogHeader className='sm:text-center'>
                                <AlertDialogTitle>{t('Are you absolutely sure')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('This action cannot be undone')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className='sm:justify-between'>
                                <AlertDialogCancel onClick={handleCancelClick}>{t('Cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmDelete}>{t('Delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </div>
                </AlertDialog>
            )}
        </div>
    )
}

export default StationCard
