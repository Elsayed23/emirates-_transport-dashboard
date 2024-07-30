'use client';
import React, { useState } from 'react';
import CreateTrafficLineForm from './_components/CreateTrafficLineForm';
import AddRisks from './_components/AddRisks';

const TrafficLineManagement = ({ params }) => {
    const [trafficLineData, setTrafficLineData] = useState(null);

    return (
        <div>
            {!trafficLineData ? (
                <CreateTrafficLineForm params={params} setTrafficLineData={setTrafficLineData} />
            ) : (
                <AddRisks trafficLineData={trafficLineData} params={params} />
            )}
        </div>
    );
};

export default TrafficLineManagement;
