import React, { useContext } from 'react'
import logo from '@/app/assets/images/singleLogo.png'
import Image from 'next/image'
import { useOpen } from '@/app/context'
import LanguageContext from '@/app/context/LanguageContext'

const Loading = () => {

    const { isOpen } = useOpen()

    const { language } = useContext(LanguageContext);


    return (
        <div className={`h-[calc(100vh-80px)] flex justify-center items-center fixed bg-white  ${isOpen ? language === 'ar' ? 'right-56 w-[calc(100%-224px)]' : 'left-56 w-[calc(100%-224px)]' : language === 'ar' ? 'right-[75px] w-[calc(100%-75px)]' : 'left-[75px] w-[calc(100%-75px)]'} duration-200  top-20 z-20`}>
            <Image src={logo} alt='spinner_logo' className='animate-spin w-20 h-2w-20' width={80} height={80} />
        </div>
    )
}

export default Loading