'use client'
import useTranslation from '@/app/hooks/useTranslation'
import Image from 'next/image'
import React from 'react'
import mido from '@/app/assets/images/mido.jpeg'
import humaid from '@/app/assets/images/humaid.png'
import { FaRegCircleUser } from 'react-icons/fa6'

const OurTeam = () => {

    const { t } = useTranslation()

    return (
        <div className='py-16 shadow-md'>
            <div className="container mx-auto">
                <div className="flex flex-col gap-12 w-5/6 box-shadow py-12 px-6 mx-auto rounded-sm">
                    <h1 className='text-4xl font-semibold text-center'>{t('work team')}</h1>
                    <div className="flex flex-col gap-10">
                        <div className="flex items-center group">
                            <div className="flex flex-col items-center gap-2 w-fit">
                                <div className="overflow-hidden rounded-full w-52 h-52">
                                    <Image src={humaid} alt='QHSE manager image' width={200} height={200} className='w-full h-full scale-125ر group-hover:scale-[1.06] rounded-full duration-200 ' />
                                </div>
                                <h3 className='text-2xl font-semibold'>{t('Himyd sultan')}</h3>
                                <p className='text-center max-w-sm'>{t('mansib hamayd')}</p>
                            </div>
                            <p className=' text-center text-lg text-[#111] max-w-xl '>{t('himyd word')}</p>
                        </div>
                        <div className='h-[1.2px] bg-slate-400'></div>
                        <div className="flex items-center group">
                            <div className="flex flex-col items-center gap-2 w-fit">
                                <div className="overflow-hidden rounded-full border-4 border-black w-36 h-36">
                                    <Image src={mido} alt='Occupational safety, environment and health officer Image' width={200} height={200} className='w-full h-full group-hover:scale-[1.06] rounded-full duration-200' />
                                </div>
                                <h3 className='text-2xl font-semibold'>{t('Abdalhameed Saeed')}</h3>
                                <p className='text-center w-[333.72px] max-w-sm'>{t('mansib mido')}</p>
                            </div>
                            <p className=' text-center text-lg text-[#111] max-w-xl '>{t('mido word')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OurTeam