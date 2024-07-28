'use client'
import React from 'react';
import SideItems from './SideItems';
import { IoMdHome } from "react-icons/io";
import { FaMapMarkedAlt } from "react-icons/fa";
import useTranslation from '@/app/hooks/useTranslation';
import { MdImageSearch, MdModelTraining } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa6';
import { useAuth } from '@/app/context/AuthContext';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useOpen } from '@/app/context';

const SidebarRoutes = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

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
            href: '/trainings'
        },
    ];

    if (user?.role?.name === 'ADMIN') {
        routes.push({
            icon: FaUsers,
            label: t('Users'),
            href: '/users'
        },
            {
                icon: FaUsers,
                label: 'طلبات الحذف',
                href: '/delete_requests'
            }
        );
    }

    const inspectionsData = [
        {
            id: 1,
            name: 'الرقابة الإلكترونية',
            href: '/reports/electronic_censorship'
        },
        {
            id: 2,
            name: 'التفتيشات',
            href: user?.role?.name === 'ADMIN' ? '/reports/users' : '/reports'
        }
    ];

    const isActive = (href) => (
        pathname === href ||
        pathname.startsWith(`reports/${href.split('/')[1]}`)
    );

    const isReportsActive = pathname.includes('report');

    const { isOpen } = useOpen()

    const types = inspectionsData.map(({ name, href }, idx) => (
        <li
            key={idx}
            onClick={() => router.push(href)}
            className={cn(
                `py-4 pl-6 pr-2 ${isOpen ? 'duration-200' : ' '} break-words cursor-pointer w-full rounded-sm text-slate-500 hover:text-slate-600 hover:bg-red-300/20 duration-200`,
                isActive(href) && 'text-red-700 hover:text-red-700 bg-red-200/20 hover:bg-red-200/20'
            )}
        >
            {name}

        </li>
    ));

    return (
        <div className='flex flex-col w-full'>
            {routes.map((route, idx) => (
                <SideItems key={idx} {...route} />
            ))}
            <Accordion type="single" collapsible defaultValue={isReportsActive ? 'item-1' : ''}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className={cn(
                        'py-0 relative text-slate-500 hover:no-underline px-6 hover:text-slate-600 hover:bg-red-300/20 duration-300',
                        isReportsActive && 'text-red-700 bg-red-200/20'
                    )}>
                        <div className={cn(
                            'flex items-center gap-2 py-4',
                            isReportsActive && 'text-red-700'
                        )}>
                            <MdImageSearch size={23} className={cn(
                                'text-slate-500',
                                isReportsActive && 'text-red-700'
                            )} />

                            <span className={`${isOpen ? 'duration-200' : 'opacity-0 hidden'} duration-200 break-words`}>{t('reports')}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="w-full">
                        <ul className="flex flex-col gap-2">
                            {types}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default SidebarRoutes;
