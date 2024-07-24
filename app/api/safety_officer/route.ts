import { db } from '@/lib/db';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    try {

        const { name, email, password } = await req.json();


        const userExists = await db.user.findUnique({ where: { email } });
        if (userExists) return NextResponse.json({ status: 400, message: "User already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await db.user.create({
            data: {
                name,
                email,
                roleId: '3dd0fd33-a709-4c62-8d41-19f21f44498a',
                password: hashedPassword,
            },
            include: {
                role: true
            }
        });

        return NextResponse.json(newUser);

    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: 'fail', error: err });
    }
}

export const GET = async () => {
    try {



        const safetyOfficers = await db.user.findMany({
            where: {
                role: {
                    name: 'SAFETY_OFFICER'
                }
            },
            select: {
                _count: true,
                id: true,
                name: true,
            },
        })


        return NextResponse.json(safetyOfficers)

    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export const DELETE = async (req: Request) => {
    try {

        const { id } = await req.json()


        await db.user.delete({
            where: {
                id
            }
        })


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

    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}
