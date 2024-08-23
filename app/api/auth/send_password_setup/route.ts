import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
const nodemailer = require('nodemailer');
const crypto = require('crypto')


export async function POST(req: Request) {
    const { email } = await req.json();
    if (!email) {
        return NextResponse.json({ message: 'Email is required' });
    }

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: 'User not found' });
        }

        // Generate a secure token
        const token = crypto.randomBytes(32).toString('hex');

        // Store the token in the database with an expiration time (e.g., 1 hour)
        await db.user.update({
            where: { email },
            data: { resetToken: token, resetTokenExpires: new Date(Date.now() + 3600000) },
        });

        // Send an email with the token
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/set_password?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Set Your Password',
            text: `Click the following link to set your password: ${resetUrl}`,
        });

        return NextResponse.json({ message: 'Password setup email sent successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}