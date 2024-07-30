import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db file
const bcrypt = require('bcryptjs');

export const GET = async () => {
    try {
        // Fetch users excluding those with 'admin' role
        const users = await db.user.findMany({
            where: {
                role: {
                    isNot: {
                        name: 'ADMIN'
                    }
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                stationId: true,
                role: true,
            }
        });

        // Return the users
        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ status: 500, message: err });
    }
};

export const PATCH = async (req: Request) => {
    try {
        const { user_id, name, email, password } = await req.json();

        if (!name || !user_id || !email || !password) {
            return NextResponse.json({ message: 'Invalid input' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user in the database
        await db.user.update({
            where: { id: user_id },
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        const users = await db.user.findMany({
            where: {
                role: {
                    isNot: {
                        name: 'ADMIN'
                    }
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                stationId: true,
                role: true,
            }
        })


        return NextResponse.json(users)
    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: 500, message: err });
    }
};