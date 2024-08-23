'use client'
import React, { useContext } from 'react';
import SideItems from './SideItems';
import { IoMdDocument, IoMdHome } from "react-icons/io";
import { FaBuilding, FaListUl, FaMapMarkedAlt } from "react-icons/fa";
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
import SingleRoute from './SingleRoute'
import { GrDocumentConfig } from "react-icons/gr";

const SidebarRoutes = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const routes = [
        // {
        //     icon: FaMapMarkedAlt,
        //     label: t('stations'),
        //     href: '/stations'
        // },
        {
            icon: MdModelTraining,
            label: 'المهمات',
            href: '/tasks'
        },
    ];

    const isAdmin = user?.role?.name === 'ADMIN';

    const isSafetyManager = user?.role?.name === 'SAFETY_MANAGER';

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
            {
                icon: FaListUl,
                label: 'التطلبات',
                href: '/requirements'
            },
            {
                icon: FaCodePullRequest,
                label: 'مهمات ضباط السلامة',
                href: '/safety_officer'
            }

        );
    }

    const typesOfRiskRegistersData = [
        {
            icon: FaMapMarkedAlt,
            label: 'المدارس وخطوط السير',
            href: '/stations'
        },
        {
            icon: FaBuilding,
            label: 'المباني والموظفين',
            href: '/buildings'
        },
    ]

    const inspectionsData = [
        {
            icon: MdDocumentScanner,
            label: t('Electronic censorship'),
            href: isAdmin || isSafetyManager || isSafetyDirector ? '/reports/electronic_censorship/users' : '/reports/electronic_censorship'
        },
        {
            icon: IoMdDocument,
            label: t('Inspections'),
            href: isAdmin || isSafetyManager || isSafetyDirector ? '/reports/users' : '/reports'
        }
    ];

    if (isAdmin || isSafetyManager) {
        inspectionsData.push(
            {
                icon: FaCodePullRequest,
                label: t('Deletion requests'),
                href: '/requests'
            },

        )

    }


    const isReportsActive = pathname.includes('report') || pathname.includes('requests');

    const { language } = useContext(LanguageContext);

    const { isOpen } = useOpen()

    const typesOfInspections = inspectionsData.map((types, idx) => (
        <SingleRoute key={idx} {...types} />
    ));
    const typesOfRiskRegisters = typesOfRiskRegistersData.map((types, idx) => (
        <SingleRoute key={idx} {...types} />
    ));
    // const isActive = (href) => {
    //     console.log(pathname, href);

    //     (pathname === '/' && href === '/')
    //         ||
    //         pathname === href
    //         ||
    //         pathname?.startsWith(`${href}/`)
    // }

    const isActive = (href) => pathname === href

    return (
        <div className='flex flex-col w-full'>
            <button onClick={() => router.push('/')} className={cn(`flex items-center gap-x-2 overflow-x-hidden text-slate-500 ${language === 'ar' ? 'pl-6 md:pl-0 md:pr-6' : 'pr-6 md:pr-0 md:pl-6'}  hover:text-slate-600 hover:bg-red-300/20 duration-300`, isActive('/') && 'text-red-700 bg-red-200/20 hover:bg-red-200/20 hover:text-red-700')}>
                <div className="flex items-center gap-2 py-4 duration-200">

                    <IoMdHome size={23} className={cn('text-slate-500', isActive('/') && 'text-red-700')} />

                    <span className={`${isOpen ? 'duration-200' : 'opacity-0 hidden'} duration-200 break-words`}>{t('home')}</span>
                </div>
                <div className={cn(`${language === 'ar' ? 'ml-auto md:ml-0 md:mr-auto' : 'mr-auto md:mr-0 md:ml-auto'}  h-full opacity-0 border-2 border-red-700 transition-all`, isActive('/') && 'opacity-100 ')}></div>
            </button>

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
                            <GrDocumentConfig size={23} className={cn(
                                'text-slate-500',
                                isReportsActive && 'text-red-700'
                            )} />

                            <span className={`${isOpen ? 'duration-200' : 'opacity-0 hidden'} duration-200 break-words`}>{t('stations')}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="w-full">
                        <div className="flex flex-col gap-2">
                            {typesOfRiskRegisters}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
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
                            {typesOfInspections}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {
                isAdmin
                    ?
                    <button onClick={() => router.push('/tasks')} className={cn(`flex items-center gap-x-2 overflow-x-hidden text-slate-500 ${language === 'ar' ? 'pl-6 md:pl-0 md:pr-6' : 'pr-6 md:pr-0 md:pl-6'}  hover:text-slate-600 hover:bg-red-300/20 duration-300`, isActive('/tasks') && 'text-red-700 bg-red-200/20 hover:bg-red-200/20 hover:text-red-700')}>
                        <div className="flex items-center gap-2 py-4 duration-200">

                            <MdModelTraining size={23} className={cn('text-slate-500', isActive('/tasks') && 'text-red-700')} />

                            <span className={`${isOpen ? 'duration-200' : 'opacity-0 hidden'} duration-200 break-words`}>المهمات</span>
                        </div>
                        <div className={cn(`${language === 'ar' ? 'ml-auto md:ml-0 md:mr-auto' : 'mr-auto md:mr-0 md:ml-auto'}  h-full opacity-0 border-2 border-red-700 transition-all`, isActive('/tasks') && 'opacity-100 ')}></div>
                    </button>
                    :
                    null
            }
        </div>
    );
};

export default SidebarRoutes;