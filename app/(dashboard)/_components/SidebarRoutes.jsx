import React, { useEffect } from 'react'
import SideItems from './SideItems'
import { IoMdHome } from "react-icons/io";
import { FaMapMarkedAlt, FaSchool } from "react-icons/fa";
import useTranslation from '@/app/hooks/useTranslation';
import { MdImageSearch, MdModelTraining } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa6';
import { useAuth } from '@/app/context/AuthContext';

const SidebarRoutes = () => {

    const { t } = useTranslation()

    const { user } = useAuth()

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
            label: t('trainings'),
            href: '/tranings'
        },
        {
            icon: MdImageSearch,
            label: t('reports'),
            href: user?.role?.name === 'ADMIN' ? '/reports/users' : '/reports'
        },


    ]

    if (user?.role?.name === 'ADMIN') {
        routes.push(
            {
                icon: FaUsers,
                label: t('Users'),
                href: '/users'
            }
        )
    }

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