import { NextResponse } from 'next/server';
const bcrypt = require('bcryptjs');
import { db } from '@/lib/db';

export const POST = async (req: Request) => {
    const { token, password } = await req.json();

    try {
        // Find the user by reset token
        const user = await db.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: {
                    gt: new Date(), // Token must be still valid
                },
            },
        });

        if (!user) {
            return NextResponse.json({ status: 400, message: "Invalid or expired token" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user with the new password and clear the reset token
        await db.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
            },
        });

        return NextResponse.json({ status: 200, message: "Password reset successfully" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: 500, message: "Internal server error" });
    }
};
