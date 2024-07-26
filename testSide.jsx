import React, { useEffect } from 'react'
import SideItems from './SideItems'
import { IoMdHome } from "react-icons/io";
import { FaMapMarkedAlt, FaSchool } from "react-icons/fa";
import useTranslation from '@/app/hooks/useTranslation';
import { MdImageSearch, MdModelTraining } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa6';
import { useAuth } from '@/app/context/AuthContext';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useRouter } from 'next/navigation';

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
        // {
        //     icon: MdImageSearch,
        //     label: t('reports'),
        //     href: user?.role?.name === 'ADMIN' ? '/reports/users' : '/reports'
        // },
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

    const typesData = [
        {
            id: 1,
            name: 'الرقابة الإلكترونية',
            href: '/repors'
        },
        {
            id: 2,
            name: 'التفتيشات',
            href: '/reports'
        }
    ]

    const router = useRouter()

    const types = typesData?.map(({ name, id, href }, idx) => {
        return (
            <li key={idx} onClick={() => router.push(href)} className={`py-2 pl-6 cursor-pointer w-full rounded-sm hover:bg-black hover:bg-opacity-10 duration-200`}>
                {name}
            </li>
        )
    })

    return (
        <div className='flex flex-col w-full'>
            {
                routes.map((routes, idx) => {
                    return <SideItems key={idx} {...routes} />
                })
            }
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className='py-0 relative hover:no-underline text-slate-500 px-6 hover:text-slate-600 hover:bg-red-300/20 hover:bg-opacity-10 duration-300'>
                        <div className={`flex items-center gap-2  py-4`}>
                            <MdImageSearch size={23} className='text-slate-500' />
                            {t('reports')}
                        </div>

                    </AccordionTrigger>
                    <AccordionContent className="w-full">
                        <ul className="flex flex-col gap-4 p-4">
                            {types}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default SidebarRoutes