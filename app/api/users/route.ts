import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db file
const axios = require('axios');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

export const POST = async (req: Request) => {
    try {
        const { name, roleId, email, gender, financialNumber } = await req.json();

        const userExists = await db.user.findUnique({ where: { email } });
        if (userExists) return NextResponse.json({ status: 400, message: "User already exists" });

        // Generate a temporary password
        const temporaryPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Create new user with the temporary password
        const newUser = await db.user.create({
            data: {
                name,
                email,
                roleId,
                approved: true,
                password: hashedPassword,
                gender,
                financialNumber,
                needsPasswordReset: true, // You can add this flag to enforce password reset on first login
            },
            select: {
                id: true,
                name: true,
                email: true,
                approved: true,
                role: true,
                gender: true,
                financialNumber: true,
            }
        });

        return NextResponse.json({ status: 200, message: 'Created user successfully! Password setup email sent.', data: newUser });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: 'fail', error: err });
    }
};

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
                approved: true,
                station: {
                    select: {
                        id: true
                    }
                },
                role: true,
                gender: true,
                financialNumber: true
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
        const { user_id, email, name, financialNumber, gender } = await req.json();

        if (!user_id || !email || !name || !financialNumber || !gender) {
            return NextResponse.json({ message: 'Invalid input' });
        }

        // Generate a temporary password
        const temporaryPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);


        // Update the user in the database
        await db.user.update({
            where: { id: user_id },
            data: {
                name,
                financialNumber,
                gender,
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
                approved: true,
                email: true,
                station: {
                    select: {
                        id: true
                    }
                },
                role: true,
                gender: true,
                financialNumber: true
            }
        })


        return NextResponse.json(users)
    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: 500, message: err });
    }
};

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
                approved: true,
                station: {
                    select: {
                        id: true
                    }
                },
                role: true,
            }
        })


        return NextResponse.json(users)

    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}