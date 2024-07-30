"use client";
import React, { useState } from 'react';
import CreateReportForm from './_components/CreateReportForm';
import AddInspections from './_components/AddInspections';

const page = () => {
    const [reportData, setReportData] = useState(null);

    return (
        <div>
            {!reportData ? (
                <CreateReportForm setReportData={setReportData} />
            ) : (
                <AddInspections reportData={reportData} />
            )}
        </div>
    );
};

export default page;
