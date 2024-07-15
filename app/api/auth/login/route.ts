import { db } from '@/lib/db';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { NextResponse } from 'next/server';

const generateToken = (userId: string, stationId: number, name: string, email: string) => {
    return jwt.sign({ id: userId, stationId, name, email }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

export const POST = async (req: Request) => {
    const { email, password } = await req.json();

    try {
        // Find user by email
        const user = await db.user.findUnique({
            where: {
                email
            },

        });
        if (!user) {
            return NextResponse.json({ status: 400, message: "Incorrect email" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ status: 400, message: "Incorrect password" });
        }

        // Generate JWT token
        const token = generateToken(user.id, user.stationId, user.name, user.email);

        // Respond with token and user details
        return NextResponse.json({ status: 200, token, user, message: 'Logged in successfully!' });
    } catch (err) {
        return NextResponse.json({ status: 500, message: err });
    }
}