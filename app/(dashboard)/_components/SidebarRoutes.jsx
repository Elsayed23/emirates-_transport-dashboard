'use client'
import React, { useContext } from 'react';
import SideItems from './SideItems';
import { IoMdDocument, IoMdHome } from "react-icons/io";
import { FaBuilding, FaListUl, FaMapMarkedAlt, FaTasks } from "react-icons/fa";
import useTranslation from '@/app/hooks/useTranslation';
import { MdDocumentScanner, MdImageSearch, MdModelTraining, MdPlaylistAdd, MdPlaylistAddCircle } from 'react-icons/md';
import { FaBook, FaCodePullRequest, FaUsers } from 'react-icons/fa6';
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
    console.log(user);

    const pathname = usePathname();
    const router = useRouter();

    const routes = [
        // {
        //     icon: FaMapMarkedAlt,
        //     label: t('stations'),
        //     href: '/stations'
        // },
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
        );
    }

    const typesOfRiskRegistersData = [
        {
            icon: FaBook,
            label: t('General Risk Register'),
            href: '/general_risk_profile'
        },
        {
            icon: FaMapMarkedAlt,
            label: t('Schools and itineraries'),
            href: '/stations'
        },
        {
            icon: FaBuilding,
            label: t('Buildings and staff'),
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

    const tasks = [
        {
            icon: MdPlaylistAdd,
            label: t('Add mission'),
            href: '/safety_officer'
        },
        {
            icon: FaCodePullRequest,
            label: t('Follow up missions'),
            href: '/safety_officer'
        },
    ]

    const AddsInfo = [
        {
            icon: BsFillQuestionSquareFill,
            label: t('Questions'),
            href: '/questions'
        },
        {
            icon: FaListUl,
            label: t('Requirements'),
            href: '/requirements'
        },
    ]

    const isReportsActive = pathname.includes('report') || pathname.includes('requests');

    const { language } = useContext(LanguageContext);

    const { isOpen } = useOpen()

    const typesOfInspections = inspectionsData.map((types, idx) => (
        <SingleRoute key={idx} {...types} />
    ));

    const typesOfRiskRegisters = typesOfRiskRegistersData.map((types, idx) => (
        <SingleRoute key={idx} {...types} />
    ));
    const tasksss = tasks.map((types, idx) => (
        <SingleRoute key={idx} {...types} />
    ));
    const Adds = AddsInfo.map((types, idx) => (
        <SingleRoute key={idx} {...types} />
    ));

    const isActive = (href) => pathname === href

    return (
        <div className='flex flex-col w-full'>
            <button onClick={() => router.push('/')} className={cn(`flex items-center text-sm gap-x-2 overflow-x-hidden text-slate-500 ${language === 'ar' ? 'pl-6 md:pl-0 md:pr-6' : 'pr-6 md:pr-0 md:pl-6'}  hover:text-slate-600 hover:bg-red-300/20 duration-300`, isActive('/') && 'text-red-700 bg-red-200/20 hover:bg-red-200/20 hover:text-red-700')}>
                <div className="flex items-center gap-2 py-4 duration-200 justify-center">

                    <IoMdHome size={23} className={cn('text-slate-500', isActive('/') && 'text-red-700')} />

                    <span className={`${isOpen ? 'duration-200' : 'opacity-0 hidden'} duration-200 break-words`}>{t('home')}</span>
                </div>
                <div className={cn(`${language === 'ar' ? 'ml-auto md:ml-0 md:mr-auto' : 'mr-auto md:mr-0 md:ml-auto'}  h-full opacity-0 border-2 border-red-700 transition-all`, isActive('/') && 'opacity-100 ')}></div>
            </button>

            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className={cn(
                        `py-0 relative text-slate-500 hover:no-underline ${language === 'ar' ? 'pl-6 md:pl-0 md:pr-6' : 'pr-6 md:pr-0 md:pl-6'} hover:text-slate-600 hover:bg-red-300/20 duration-300`,
                    )}>
                        <div className={cn(
                            'flex items-center gap-2 py-4',
                        )}>
                            <FaTasks size={23} className={cn(
                                'text-slate-500',
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


            <Accordion type="single" collapsible>
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
                isSafetyManager || isAdmin
                    ?

                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className={cn(
                                `py-0 relative text-slate-500 hover:no-underline ${language === 'ar' ? 'pl-6 md:pl-0 md:pr-6' : 'pr-6 md:pr-0 md:pl-6'} hover:text-slate-600 hover:bg-red-300/20 duration-300`,
                            )}>
                                <div className={cn(
                                    'flex items-center gap-2 py-4',
                                )}>
                                    <MdModelTraining size={23} className={cn(
                                        'text-slate-500',
                                    )} />

                                    <span className={`${isOpen ? 'duration-200' : 'opacity-0 hidden'} duration-200 break-words`}>{t('Tasks')}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="w-full">
                                <div className="flex flex-col gap-2">
                                    {tasksss}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    :
                    null
            }

            {
                isAdmin
                    ?

                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className={cn(
                                `py-0 relative text-slate-500 hover:no-underline ${language === 'ar' ? 'pl-6 md:pl-0 md:pr-6' : 'pr-6 md:pr-0 md:pl-6'} hover:text-slate-600 hover:bg-red-300/20 duration-300`,
                            )}>
                                <div className={cn(
                                    'flex items-center gap-2 py-4',
                                )}>
                                    <MdPlaylistAddCircle size={23} className={cn(
                                        'text-slate-500',
                                    )} />

                                    <span className={`${isOpen ? 'duration-200' : 'opacity-0 hidden'} duration-200 break-words`}>{t('Additions')}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="w-full">
                                <div className="flex flex-col gap-2">
                                    {Adds}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    :
                    null
            }

            {routes.map((route, idx) => (
                <SideItems key={idx} {...route} />
            ))}
        </div>

    );
};

export default SidebarRoutes;