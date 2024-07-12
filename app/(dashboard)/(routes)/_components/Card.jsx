import useTranslation from '@/app/hooks/useTranslation'
import React from 'react'

const Card = ({
    icon,
    title,
    data
}) => {

    const { t } = useTranslation()

    return (
        <div className='py-5 hover:-translate-y-4 duration-200 px-2 shadow-lg border rounded-sm flex flex-col items-center gap-3'>
            {icon}
            <h2 className='text-lg font-medium'> {t(title)} </h2>
            <h1 className='text-2xl font-bold'>{data}</h1>
        </div>
    )
}

export default Card