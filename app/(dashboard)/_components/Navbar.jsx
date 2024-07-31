'use client'
import React, { useContext } from 'react'
import MobileSideBar from './MobileSideBar'
import logo from '@/app/assets/images/nav-logo.jpg'
import Image from 'next/image'
import { useOpen } from '@/app/context'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import LanguageContext from '@/app/context/LanguageContext'
import useTranslation from '@/app/hooks/useTranslation'
import { useAuth } from '@/app/context/AuthContext'
const Navbar = () => {

    const { isOpen } = useOpen()
    const { changeLanguage, language } = useContext(LanguageContext);
    const { user } = useAuth()
    const { t } = useTranslation()

    return (
        <div className={`h-20 ${isOpen ? `${language === 'ar' ? 'md:pr-56' : 'md:pl-56'}` : `${language === 'ar' ? 'md:pr-[75px]' : 'md:pl-[75px]'}`} fixed  duration-200 top-0 w-full z-50`}>
            <div className="p-4 border-b h-full flex items-center justify-between bg-white shadow-sm">
                <MobileSideBar />
                <Select value={language} onValueChange={(e) => changeLanguage(e)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="ar">{t('lang.Arabic')}</SelectItem>
                            <SelectItem value="en">{t('lang.English')}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <h3>{t('Hello')} {user?.name}</h3>
                <Image src={logo} width={250} height={80} alt='logo' className={`h-16 object-contain`} />


            </div>
        </div>
    )
}

export default Navbar