'use client'
import Sidebar from './_components/Sidebar';
import React, { useContext } from 'react'
import Navbar from './_components/Navbar'
import { useOpen } from '@/app/context';
import LanguageContext from '../context/LanguageContext';

const Layout = ({
    children
}) => {

    const { isOpen } = useOpen()
    const { language } = useContext(LanguageContext);

    return (
        <div className='h-full' dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />
            <div className={`hidden md:flex flex-col ${isOpen ? 'w-56' : 'w-[75px]'} duration-300 h-full fixed top-0 bottom-0 z-50`}>
                <Sidebar />
            </div>
            <main className={`${isOpen ? `${language === 'ar' ? 'md:pr-56' : 'md:pl-56'}` : `${language === 'ar' ? 'md:pr-[75px]' : 'md:pl-[75px]'}`} pt-20 relative duration-300 z-20`}>
                {children}
            </main>
        </div>
    )
}

export default Layout