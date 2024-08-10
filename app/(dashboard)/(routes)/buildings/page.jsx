'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Card from './_components/Card'
import DynamicBreadcrumb from '../../_components/DynamicBreadcrumb'
import useTranslation from '@/app/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Loading from '../../_components/Loading'
import { useAuth } from '@/app/context/AuthContext'
import { toast } from 'sonner'

const page = () => {

    const [buildingsData, setBuildingsData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [toggleDeleteBuilt, setToggleDeleteBuilt] = useState(false)

    const { user } = useAuth()

    const { t } = useTranslation()

    const getBuildings = async () => {
        try {
            const { data } = await axios.get(`/api/built`)
            console.log(data);

            setBuildingsData(data)
            setLoading(false)


        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteBuilt = async (id) => {
        try {

            await axios.delete(`/api/built/${id}`)

            toast.success(t('The report has been successfully deleted'))
            setToggleDeleteBuilt(prev => !prev)

        } catch (error) {
            console.log(error);
        }
    }

    const reportsCard = buildingsData?.map((card, idx) => {
        return (
            <Card key={idx} handleDeleteBuilt={handleDeleteBuilt} {...card} />
        )
    })
    useEffect(() => {
        getBuildings()
    }, [user, toggleDeleteBuilt])


    const router = useRouter()


    const breadcrumbData = [
        {
            title: 'مخاطر المباني'
        },
    ]

    if (loading) return <Loading />


    return (
        <div className="p-6 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col gap-9">
                <DynamicBreadcrumb routes={breadcrumbData} />
                <Button className='w-fit' onClick={() => router.push('/buildings/add')}>إضافة مبني</Button>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {reportsCard}
                </div>
            </div>
        </div>
    )
}

export default page