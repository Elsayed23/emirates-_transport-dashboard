import { db } from '@/lib/db';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { NextResponse } from 'next/server';

const generateToken = (userId: string, email: string) => {
    return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

export const POST = async (req: Request) => {
    try {

        const { name, roleId, email, password } = await req.json();


        const userExists = await db.user.findUnique({ where: { email } });
        if (userExists) return NextResponse.json({ status: 400, message: "User already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await db.user.create({
            data: {
                name,
                email,
                roleId,
                password: hashedPassword,
            },
        });

        const token = generateToken(newUser.id, newUser.email);

        return NextResponse.json({ status: 200, message: 'Registered successfully!', token, user: newUser });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: 'fail', error: err });
    }
}
