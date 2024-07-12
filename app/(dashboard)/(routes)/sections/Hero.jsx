'use client'
import React from 'react'
import useTranslation from '@/app/hooks/useTranslation'


const Hero = () => {

    const { t } = useTranslation();

    // Abdalhameed Saeed
    // supervised by
    // Himyd sultan

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 bg-[url(./assets/images/bg.jpg)] w-full before:z-10 bg-cover relative before:absolute before:indent-0 before:bg-black before:bg-opacity-75 before:w-full before:h-full">
            <div className="relative flex flex-col items-center gap-6 z-20 text-white">
                <h1 className="text-5xl font-medium text-center max-w-4xl leading-tight">{t('hero.title')}</h1>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center text-2xl">
                        <h3>{t('Developed by')}: <span className='font-semibold underline underline-offset-4'>{t('Abdalhameed Saeed')}</span> {t('supervised by')}: <span className='font-semibold underline underline-offset-4'>{t('Himyd sultan')}</span></h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero