'use client';
import React, { useState } from 'react';
import CreateTrafficLineForm from './_components/CreateTrafficLineForm';

const TrafficLineManagement = ({ params }) => {
    return (
        <div>
            <CreateTrafficLineForm params={params} />
        </div>
    );
};

export default TrafficLineManagement;
