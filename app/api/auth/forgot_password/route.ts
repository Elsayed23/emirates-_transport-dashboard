import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
const nodemailer = require('nodemailer');
const crypto = require('crypto');

export const POST = async (req: Request) => {
    const { email } = await req.json();

    try {
        // Check if the user exists
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ status: 400, message: "Email not found" });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Store the token in the database with an expiration time
        await db.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpires: new Date(Date.now() + 3600000), // 1 hour from now
            },
        });

        // Send an email with the reset link
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
            auth: {
                user: process.env.EMAIL, // Your email address
                pass: process.env.PASS, // Your email password
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset_password?token=${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`,
        });

        return NextResponse.json({ status: 200, message: "Password reset link sent. Please check your email." });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: 500, message: "Internal server error" });
    }
};
