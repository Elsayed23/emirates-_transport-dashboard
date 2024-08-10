'use client'
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { cn } from '@/lib/utils';
import { useOpen } from '@/app/context';

const SingleRoute = ({
    label,
    href,
    icon: Icon,
}) => {

    const pathname = usePathname();
    const router = useRouter();

    const { isOpen } = useOpen()

    const isActive = (href) => (
        pathname === href
        ||
        pathname.startsWith(`/reports/${href.split('/')[1]}`)
        ||
        pathname.startsWith(href)
    );


    return (
        <button
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
    )
}

export default SingleRoute