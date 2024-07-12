import React from 'react'
import SideItems from './SideItems'
import { IoMdHome } from "react-icons/io";
import { FaMapMarkedAlt, FaSchool } from "react-icons/fa";
import useTranslation from '@/app/hooks/useTranslation';
import { MdModelTraining } from 'react-icons/md';

const SidebarRoutes = () => {

    const { t } = useTranslation()

    const routes = [
        {
            icon: IoMdHome,
            label: t('home'),
            href: '/'
        },
        {
            icon: FaMapMarkedAlt,
            label: t('stations'),
            href: '/stations'
        },
        {
            icon: MdModelTraining,
            label: t('schools'),
            href: '/schools'
        },

    ]



    return (
        <div className='flex flex-col w-full'>
            {
                routes.map((routes, idx) => {
                    return <SideItems key={idx} {...routes} />
                })
            }
        </div>
    )
}

export default SidebarRoutes