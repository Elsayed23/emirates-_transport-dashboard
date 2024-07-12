import React, { useContext } from 'react'
import SidebarRoutes from './SidebarRoutes'
import logo from '@/app/assets/images/logo.svg'
import Image from 'next/image'
import { MdArrowForwardIos } from "react-icons/md";
import { useOpen } from '@/app/context'
import LanguageContext from '@/app/context/LanguageContext'

const Sidebar = () => {

    const { isOpen, setIsOpen } = useOpen()
    const { language } = useContext(LanguageContext);


    return (
        <div className={`flex flex-col gap-2 h-full ${language === 'ar' ? 'border-l' : 'border-r'} relative bg-white`}>
            {/* <div className="pt-5 px-3">
                <div className="p-2 rounded-full hover:bg-green-800  hover:text-white w-fit duration-200 cursor-pointer" onClick={() => setIsOpen(false)}>
                    <HiXMark size={22} />
                </div>
            </div> */}
            <div className={`${isOpen ? 'p-8' : 'p-2'} duration-200`}>

                <Image src={logo} alt='logo' width={200} height={56} className={`h-14 ${!isOpen ? 'object-cover' : ''} duration-200 object-right`} />

            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
            <div className={`absolute top-2/4 ${language === 'ar' ? 'left-0' : 'right-0'} -translate-y-full `}>
                <div className={`p-2 hover:bg-green-800  hover:text-white ${language === 'ar' ? 'rounded-tr-2xl rounded-br-2xl' : 'rounded-tl-2xl rounded-bl-2xl'} duration-200 cursor-pointer`} onClick={() => setIsOpen(prev => !prev)}>
                    {/* <MdArrowForwardIos size={25} className={`${!isOpen ? `${language === 'ar' ? 'rotate-180' : 'rotate-180'}` : 'rotate-180'}`} /> */}
                    {
                        language === 'ar'
                            ?
                            <MdArrowForwardIos size={25} className={`${!isOpen ? 'rotate-180' : 'rotate-0'}`} />
                            :
                            <MdArrowForwardIos size={25} className={`${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                    }
                </div>
            </div>
        </div>
    )
}

export default Sidebar