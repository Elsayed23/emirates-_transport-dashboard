import React from 'react'
import DeleteRequestDataTable from './_components/DeleteRequestsDataTable'

const page = () => {
  return (
    <div className='p-6 flex flex-col gap-12'>
      <div className="flex flex-col">
        <h3 className='text-xl font-medium'>طلبات الحذف</h3>
        <DeleteRequestDataTable />
      </div>
      <div className="flex flex-col">
        <h3 className='text-xl font-medium'>طلبات الموافقة علي التقارير</h3>
        {/* <DeleteRequestDataTable /> */}
      </div>
    </div>
  )
}

export default page