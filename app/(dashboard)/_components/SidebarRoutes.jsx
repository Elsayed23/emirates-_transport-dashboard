'use client'
import React, { useContext } from 'react';
import SideItems from './SideItems';
import { IoMdDocument, IoMdHome } from "react-icons/io";
import { FaMapMarkedAlt } from "react-icons/fa";
import useTranslation from '@/app/hooks/useTranslation';
import { MdDocumentScanner, MdImageSearch, MdModelTraining } from 'react-icons/md';
import { FaCodePullRequest, FaUsers } from 'react-icons/fa6';
import { BsFillQuestionSquareFill } from "react-icons/bs";
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
import LanguageContext from '@/app/context/LanguageContext';

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

    const isAdmin = user?.role?.name === 'ADMIN';

    const isSafetyManaget = user?.role?.name === 'SAFETY_MANAGER';

    const isSafetyDirector = user?.role?.name === 'SAFETY_DIRECTOR';

    if (isAdmin) {
        routes.push({
            icon: FaUsers,
            label: t('Users'),
            href: '/users'
        },
            {
                icon: BsFillQuestionSquareFill,
                label: 'الاسئلة',
                href: '/questions'
            },

        );
    }

    const inspectionsData = [
        {
            icon: MdDocumentScanner,
            label: t('Electronic censorship'),
            href: isAdmin || isSafetyManaget || isSafetyDirector ? '/reports/electronic_censorship/users' : '/reports/electronic_censorship'
        },
        {
            icon: IoMdDocument,
            label: t('Inspections'),
            href: isAdmin || isSafetyManaget || isSafetyDirector ? '/reports/users' : '/reports'
        }
    ];

    if (isAdmin || isSafetyManaget) {
        inspectionsData.push(
            {
                icon: FaCodePullRequest,
                label: t('Deletion requests'),
                href: '/requests'
            }
        )
    }

    const isActive = (href) => (
        pathname === href
        ||
        pathname.startsWith(`reports/${href.split('/')[1]}`)
    );

    const isReportsActive = pathname.includes('report') || pathname.includes('requests');

    const { language } = useContext(LanguageContext);

    const { isOpen } = useOpen()

    const types = inspectionsData.map(({ label, href, icon: Icon }, idx) => (
        <button
            key={idx}
            onClick={() => router.push(href)}
            className={cn(
                `pl-6 pr-2 break-words overflow-x-hidden w-full rounded-sm text-slate-500 hover:text-slate-600 hover:bg-red-300/20 duration-200`,
                isActive(href) && 'text-red-700 hover:text-red-700 bg-red-200/20 hover:bg-red-200/20'
            )}
        >
            <div className="flex items-center gap-2 py-4 duration-200">

                <Icon size={23} className={cn('text-slate-500', isActive(href) && 'text-red-700')} />

                <span className={`${isOpen ? 'duration-200' : 'opacity-0 hidden'} duration-200 break-words`}>{label}</span>
            </div>

        </button>
    ));

    return (
        <div className='flex flex-col w-full'>
            {routes.map((route, idx) => (
                <SideItems key={idx} {...route} />
            ))}
            <Accordion type="single" collapsible defaultValue={isReportsActive ? 'item-1' : ''}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className={cn(
                        `py-0 relative text-slate-500 hover:no-underline ${language === 'ar' ? 'pl-6 md:pl-0 md:pr-6' : 'pr-6 md:pr-0 md:pl-6'} hover:text-slate-600 hover:bg-red-300/20 duration-300`,
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
                        <div className="flex flex-col gap-2">
                            {types}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default SidebarRoutes;