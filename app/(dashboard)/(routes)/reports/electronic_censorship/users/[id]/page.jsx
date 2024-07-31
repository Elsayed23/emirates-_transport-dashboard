'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Card from './_components/Card'
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb'
import useTranslation from '@/app/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import Loading from '@/app/(dashboard)/_components/Loading'
import { useAuth } from '@/app/context/AuthContext'

const page = ({ params: { id } }) => {

    const [reportsData, setReportsData] = useState(null)
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams()


    const nameOfOfficer = searchParams.get('officer')

    const { user } = useAuth()

    const reportsCard = reportsData?.map((card, idx) => {
        return (
            <Card key={idx} {...card} />
        )
    })

    const getReports = async () => {
        try {
            if (user) {
                const { data } = await axios.get(`/api/safety_officer/${id}?is_electronic_censorship=true`)
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
            url: '/reports/users',
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
                        <h2 className='text-2xl text-center'>لا يوجد اي تقارير لهذا الضابط</h2>
                        :
                        <div className="grid grid-cols-2 gap-6">
                            {reportsCard}
                        </div>
                }
            </div>
        </div>
    )
}

export default page