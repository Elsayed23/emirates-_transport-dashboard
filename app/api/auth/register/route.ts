import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

export const POST = async (req: Request) => {
    const { name, email, password, roleId, gender, financialNumber } = await req.json();

    try {
        // Check if the user already exists
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return NextResponse.json({ status: 400, message: "Email is already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user but set them as not approved initially
        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roleId,
                approved: false,
                gender,
                financialNumber
            },
            select: {
                name: true,
                email: true,
                role: {
                    select: {
                        name: true
                    }
                },
                financialNumber: true
            }
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
            auth: {
                user: process.env.EMAIL, // Your email address
                pass: process.env.PASS, // Your email password
            },
        });

        const adminEmail = process.env.ADMIN_EMAIL; // Admin email address stored in environment variables

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: adminEmail,
            subject: 'New User Registration Pending Approval',
            text: `Hello AbdAlhameed,\n\nA new user has registered with the following details:\n\nName: ${name}\nRole: ${newUser.role?.name}\nFinancial Number: ${newUser.financialNumber}\nEmail: ${email}\n\nPlease log in to the admin panel to review and approve the registration. go to => <a href="http://localhost:3000/approve_users">approve page</a>`,
        });

        return NextResponse.json({ status: 201, message: "Registration successful! Please wait for approval." });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: 500, message: "Internal server error" });
    }
};
