'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Card from '../_components/Card'
import DynamicBreadcrumb from '../../../_components/DynamicBreadcrumb'
import useTranslation from '@/app/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Loading from '../../../_components/Loading'
import { useAuth } from '@/app/context/AuthContext'

const page = () => {

    const [reportsData, setReportsData] = useState([])
    const [loading, setLoading] = useState(true)

    const { user } = useAuth()

    const reportsCard = reportsData?.map((card, idx) => {
        return (
            <Card key={idx} {...card} />
        )
    })

    const getReports = async () => {
        try {
            if (user) {
                const { data } = await axios.get(`/api/reports/electronic_censorship?user_id=${user?.id}`)
                setReportsData(data)
                setLoading(false)
            }


        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getReports()
    }, [user])

    const { t } = useTranslation()

    const router = useRouter()

    const breadcrumbData = [
        {
            url: '/reports',
            title: t('Electronic censorship')
        },
    ]

    if (loading) return <Loading />


    return (
        <div className="p-6 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col gap-9">
                <DynamicBreadcrumb routes={breadcrumbData} />
                <Button className='w-fit' onClick={() => router.push(`/reports/create?inspection_id=5f43feba-0e19-4925-8d26-a3bd263cfee3`)}>{t('Create a report')}</Button>
                <div className="grid grid-cols-2 gap-6">
                    {reportsCard}
                </div>
            </div>
        </div>
    )
}

export default page