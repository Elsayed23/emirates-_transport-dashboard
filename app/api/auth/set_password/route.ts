import { db } from '@/lib/db'; // Adjust the path to your db file
import { NextResponse } from 'next/server';
const bcrypt = require('bcryptjs');

export const POST = async (req: Request) => {
    const { token, password } = await req.json();

    if (!token || !password) {
        return NextResponse.json({ message: 'Token and password are required' }, { status: 400 });
    }

    try {
        const user = await db.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: {
                    gt: new Date(), // Ensure the token hasn't expired
                },
            },
        });

        if (!user) {
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and clear the reset token
        await db.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null, // Clear the reset token so it can't be used again
                resetTokenExpires: null, // Clear the token expiration
                needsPasswordReset: false, // Optional: clear the reset requirement
            },
        });

        return NextResponse.json({ message: 'Password set successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
