'use client'
import React, { useContext } from 'react';
import SideItems from './SideItems';
import { IoMdDocument, IoMdHome } from "react-icons/io";
import { FaBuilding, FaMapMarkedAlt } from "react-icons/fa";
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
        {
            icon: IoMdHome,
            label: t('home'),
            href: '/'
        },
        // {
        //     icon: FaMapMarkedAlt,
        //     label: t('stations'),
        //     href: '/stations'
        // },
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

    const typesOfRiskRegistersData = [
        {
            icon: FaMapMarkedAlt,
            label: 'مخاطر المدارس والطرق',
            href: '/stations'
        },
        {
            icon: FaBuilding,
            label: 'مخاطر المباني',
            href: '/buildings'
        },
    ]

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


    const isReportsActive = pathname.includes('report') || pathname.includes('requests');

    const { language } = useContext(LanguageContext);

    const { isOpen } = useOpen()

    const typesOfInspections = inspectionsData.map((types, idx) => (
        <SingleRoute key={idx} {...types} />
    ));
    const typesOfRiskRegisters = typesOfRiskRegistersData.map((types, idx) => (
        <SingleRoute key={idx} {...types} />
    ));


    return (
        <div className='flex flex-col w-full'>
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
        </div>
    );
};

export default SidebarRoutes;