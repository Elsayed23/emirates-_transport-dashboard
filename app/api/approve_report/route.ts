import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other service you use
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

export async function PATCH(req: Request) {
    try {
        const { reportId, approved, rejectionReason } = await req.json();

        // Build the data object based on approval or rejection
        const updateData: any = { approved, rejectionReason: approved ? null : rejectionReason };


        // Update the report in the database
        await db.report.update({
            where: {
                id: reportId,
            },
            data: updateData,
        });

        // Retrieve the report and related user
        const report = await db.report.findUnique({
            where: { id: reportId },
            include: { user: true, inspections: { select: { name: true } }, school: {select: {name: true}} },
        });

        if (!report) {
            throw new Error('Report not found');
        }

        const { user, stationId, nameOfStation,  inspections } = report;

        // Retrieve all necessary users
        const admin = await db.user.findFirst({
            where: {
                role: {
                    name: 'ADMIN',
                },
            },
            select: {
                email: true,
                name: true,
            },
        });

        const safetyDirectors = await db.user.findMany({
            where: {
                role: {
                    name: 'SAFETY_DIRECTOR',
                },
            },
            select: {
                email: true,
                name: true,
            },
        });

        const operationsManagers = await db.user.findMany({
            where: {
                role: {
                    name: 'OPERATIONS_MANAGER',
                },
                station: {
                    id: stationId
                },
            },
            select: {
                email: true,
                name: true,
            },
        });

        if (approved) {
            // Send email to the officer
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: user?.email,
                subject: 'Your report has been approved',
                text: `Hello ${user?.name},\n\nYour report has been approved.\n\nStation: ${nameOfStation} - School: ${report.school.name} - Type of report: ${inspections[0].name}`,
            });

            // Send email to the admin
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: admin?.email,
                subject: 'A new report has been approved',
                text: `Hello ${admin?.name},\n\nA new report from ${user?.name} has been approved.\n\nStation: ${nameOfStation} - School: ${report.school.name} - Type of report: ${inspections[0].name}.\n\n<a href="http://localhost:3000/reports/${report.id}">See report</a>`,
            });

            // Send emails to safety directors
            for (const safetyDirector of safetyDirectors) {
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: safetyDirector.email,
                    subject: 'A new report has been approved',
                    text: `Hello ${safetyDirector.name},\n\nA new report from ${user?.name} has been approved.\n\nStation: ${nameOfStation} - School: ${report.school.name} - Type of report: ${inspections[0].name}.\n\n<a href="http://localhost:3000/reports/${report.id}">See report</a>`,
                });
            }

            // Send emails to operations managers
            for (const operationsManager of operationsManagers) {
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: operationsManager.email,
                    subject: 'A new report has been approved',
                    text: `Hello ${operationsManager.name},\n\nA new report from ${user?.name} has been approved.\n\nStation: ${nameOfStation} - School: ${report.school.name} - Type of report: ${inspections[0].name}.\n\n<a href="http://localhost:3000/reports/${report.id}">See report</a>`,
                });
            }
        } else {
            // Send email to the officer with the rejection reason
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: user?.email,
                subject: 'Your report has been rejected',
                text: `Hello ${user?.name},\n\nYour report has been rejected for the following reason:\n\n${rejectionReason}\n\nStation: ${nameOfStation} - School: ${report.school.name} - Type of report: ${inspections[0].name}.\n\n<a href="http://localhost:3000/reports/${report.id}">See report</a>`,
            });
        }

        const message = approved
            ? 'Report approved successfully'
            : 'Report rejected successfully';

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}


export const GET = async () => {
    try {
        const reports = await db.report.findMany({
            where: {
                approved: false,
                rejectionReason: null
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
};