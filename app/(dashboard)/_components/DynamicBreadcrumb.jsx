import { Fragment } from 'react'
import { Slash } from "lucide-react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import useTranslation from '@/app/hooks/useTranslation'

const DynamicBreadcrumb = ({ routes }) => {
    const isNotLastRoute = routes.slice(0, routes.length - 1).map(({ url, title }, idx) => (
        <Fragment key={idx}>
            <BreadcrumbItem>
                <Link href={url} >{title}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
                <Slash />
            </BreadcrumbSeparator>
        </Fragment>
    ))

    const { title } = routes[routes.length - 1]

    const { t } = useTranslation()

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link href="/" >{t('home')}</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <Slash />
                </BreadcrumbSeparator>
                {isNotLastRoute}
                <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default DynamicBreadcrumb