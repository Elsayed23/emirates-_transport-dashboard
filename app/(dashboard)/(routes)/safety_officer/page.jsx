'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SafetyOfficers() {
    const [officers, setOfficers] = useState([]);

    useEffect(() => {
        const fetchOfficers = async () => {
            const res = await fetch('/api/safety_officer/all');
            const data = await res.json();
            setOfficers(data);
        };

        fetchOfficers();
    }, []);

    return (
        <div>
            <h1>Safety Officers</h1>
            <ul>
                {officers.map((officer) => (
                    <li key={officer.id}>
                        <Link href={`/safety_officer/${officer.id}/analytics`}>
                            {officer.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
