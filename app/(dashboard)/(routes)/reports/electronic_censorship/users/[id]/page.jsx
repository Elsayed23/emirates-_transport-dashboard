'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Card from '../../../_components/Card'
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb'
import useTranslation from '@/app/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import Loading from '@/app/(dashboard)/_components/Loading'
import { useAuth } from '@/app/context/AuthContext'
import { toast } from 'sonner'

const Page = ({ params: { id } }) => {

    const [reportsData, setReportsData] = useState(null)
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams()
    const nameOfOfficer = searchParams.get('officer')
    const { user } = useAuth()

    const handleDeleteReport = async (id) => {
        try {
            await axios.delete(`/api/reports/${id}`)
            toast.success(t('The report has been successfully deleted'))
            setReportsData(prevData => prevData.filter(report => report.id !== id))
        } catch (error) {
            console.log(error)
        }
    }


    const reportsCard = reportsData?.map((card, idx) => {
        return (
            <Card key={idx} handleDeleteReport={handleDeleteReport} {...card} />
        )
    })


    const getReports = async () => {
        try {
            if (user) {
                const { data } = await axios.get(`/api/safety_officer/${id}?is_electronic_censorship=true`)

                // If the role is 'safety', filter and keep only approved reports
                const filteredData = user?.role?.name === 'SAFETY_DIRECTOR'
                    ? data.filter(report => report.approved)
                    : data;

                setReportsData(filteredData)
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
            url: '/reports/electronic_censorship/users',
            title: t('Safety Officer Reports')
        },
        {
            title: nameOfOfficer
        }
    ]

    if (loading) return <Loading />

    return (
        <div className="p-6 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col gap-9">
                <DynamicBreadcrumb routes={breadcrumbData} />
                {
                    reportsData.length === 0
                        ?
                        <h2 className='text-2xl text-center'>{t('No reports for this officer')}</h2>
                        :
                        <div className="grid grid-cols-2 gap-6">
                            {reportsCard}
                        </div>
                }
            </div>
        </div>
    )
}

export default Page
