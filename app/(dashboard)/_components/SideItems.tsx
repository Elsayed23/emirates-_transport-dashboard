'use client'
import React, { useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { IconType } from 'react-icons';
import { useOpen } from '@/app/context';
import LanguageContext from '@/app/context/LanguageContext';


interface SidebarItemsProps {
  icon: IconType;
  label: string;
  href: string;
}

const SideItems = ({
  icon: Icon,
  label,
  href,
}: SidebarItemsProps) => {


  const pathname = usePathname()

  const router = useRouter()

  const { language } = useContext(LanguageContext);

  const { isOpen } = useOpen()

  const isActive =
    (pathname === '/' && href === '/')
    ||
    pathname === href
    ||
    pathname?.startsWith(`${href}/`)

  const onClick = () => {
    router.push(href)
  }


  return (
    <button onClick={onClick} className={cn(`flex items-center gap-x-2 overflow-x-hidden text-left text-sm text-slate-500 ${language === 'ar' ? 'pl-6 md:pl-0 md:pr-6' : 'pr-6 md:pr-0 md:pl-6'}  hover:text-slate-600 hover:bg-red-300/20 duration-300`, isActive && 'text-red-700 bg-red-200/20 hover:bg-red-200/20 hover:text-red-700')}>
      <div className="flex items-center gap-2 py-4 duration-200 justify-center">

        <Icon size={23} className={cn('text-slate-500', isActive && 'text-red-700')} />

        <span className={`${isOpen ? 'duration-200' : 'opacity-0 hidden'} duration-200 break-words`}>{label}</span>
      </div>
      <div className={cn(`${language === 'ar' ? 'ml-auto md:ml-0 md:mr-auto' : 'mr-auto md:mr-0 md:ml-auto'}  h-full opacity-0 border-2 border-red-700 transition-all`, isActive && 'opacity-100 ')}></div>
    </button>
  )
}

export default SideItems