'use client'
import React, { useEffect, useState } from 'react'
import UsersDataTable from './_components/UsersDataTable'
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const page = () => {

    const [isEnabled, setIsEnabled] = useState(false);


    const getButtonStatus = async () => {
        try {

            const { data } = await axios.get('/api/updateTrafficLineButtonStatus')

            const { status } = data

            setIsEnabled(status)

        } catch (error) {
            console.log(error);

        }
    }

    const toggleSwitch = async () => {
        try {
            await axios.patch('/api/updateTrafficLineButtonStatus');

            setIsEnabled(prev => !prev);

            toast.success('تم تغيير الحالة')
        } catch (error) {
            console.log(error);

        }
    };

    useEffect(() => {
        getButtonStatus()
    }, [])

    return (
        <div className='p-6'>
            <div className="flex items-center space-x-2 justify-center" dir='ltr'>
                <Switch id="airplane-mode" checked={isEnabled} onCheckedChange={toggleSwitch} />
                <Label htmlFor="airplane-mode">Update Risks Status</Label>
            </div>
            <UsersDataTable />
        </div>
    )
}

export default page