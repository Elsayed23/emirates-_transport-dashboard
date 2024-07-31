'use client'
import React, { useState } from 'react'
import DeleteRequestDataTable from './_components/DeleteRequestsDataTable'
import ApproveDataTable from './_components/ApproveDataTable'
import RejectedReportsDataTable from './_components/RejectedDataTable'

const page = () => {

  const [toggleRejectedReport, setToggleRejectedReport] = useState(false)

  return (
    <div className='p-6 flex flex-col gap-7'>
      <div className="flex flex-col">
        <h3 className='text-xl font-medium'>طلبات حذف الملاحظات</h3>
        <DeleteRequestDataTable />
      </div>
      <hr />
      <div className="flex flex-col">
        <h3 className='text-xl font-medium'>طلبات الموافقة علي التقارير</h3>
        <ApproveDataTable setToggleRejectedReport={setToggleRejectedReport} />
      </div>
      <hr />
      <div className="flex flex-col">
        <h3 className='text-xl font-medium'>التقارير المرفوضة</h3>
        <RejectedReportsDataTable toggleRejectedReport={toggleRejectedReport} />
      </div>
    </div>
  )
}

export default page