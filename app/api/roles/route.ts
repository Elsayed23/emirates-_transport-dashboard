import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db file

export const GET = async () => {
    try {

        const roles = await db.role.findMany({
            where: {
                name: {
                    not: 'ADMIN',
                },
            },
            select: {
                id: true,
                name: true,
            },
        });

        // Return the users
        return NextResponse.json(roles);
    } catch (err) {
        return NextResponse.json({ status: 500, message: err });
    }
};