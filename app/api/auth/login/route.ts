import { db } from '@/lib/db';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { NextResponse } from 'next/server';

const generateToken = (userId: string, stationId: string | undefined, name: string, email: string, role: any) => {
    return jwt.sign({ id: userId, stationId, name, email, role }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

export const POST = async (req: Request) => {
    const { email, password } = await req.json();

    try {

        const user = await db.user.findUnique({
            where: {
                email
            },
            include: {
                role: true,
                station: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ status: 400, message: "Incorrect email" });
        }

        if (!user.approved) {
            return NextResponse.json({ status: 403, message: "You are not approved yet" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ status: 400, message: "Incorrect password" });
        }

        const token = generateToken(user.id, user.station?.id, user.name, user.email, user.role);


        return NextResponse.json({ status: 200, token, message: 'Logged in successfully!' });
    } catch (err) {
        return NextResponse.json({ status: 500, message: err });
    }
};
