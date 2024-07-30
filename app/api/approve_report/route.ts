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
        const updateData: any = { approved };
        if (!approved) {
            updateData.rejectionReason = rejectionReason;
        }

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
            include: { user: true, inspections: { select: { name: true } } },
        });

        if (!report) {
            throw new Error('Report not found');
        }

        const { user } = report;

        if (approved) {
            // Retrieve the manager's email based on role (assuming 'Manager' role exists)
            const manager = await db.user.findFirst({
                where: {
                    role: {
                        name: 'ADMIN',
                    },
                    name: "Huseib"
                },
            });
            const stationManagers = await db.user.findFirst({
                where: {
                    role: {
                        name: 'STATION',
                    },
                    stationId: Number(report.stationId),
                },
                select: {
                    email: true,
                },
            });

            if (!manager) {
                throw new Error('Manager not found');
            }


            // Send email to the officer
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Your report has been approved',
                text: `Hello ${user.name},\n\nYour report has been approved.\n\ station (${report.nameOfStation}) - school (${report.nameOfSchool}) type of report ${report.inspections[0].name}`,
            });

            // Send email to the manager
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: manager.email,
                subject: 'A new report has been approved',
                text: `Hello ${manager.name},\n\nA new report from ${user.name} has been approved.\n\ station (${report.nameOfStation}) - school (${report.nameOfSchool}) type of report ${report.inspections[0].name}.\n\ <a href="http://localhost:3000/reports/${report.id}">see report</a>`,
            });
            // Send email to the mido
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: 'Abdulhamid.Said@et.ae',
                subject: 'A new report has been approved',
                text: `Hello ${manager.name},\n\nA new report from ${user.name} has been approved.\n\ station (${report.nameOfStation}) - school (${report.nameOfSchool}) type of report ${report.inspections[0].name}.\n\ <a href="http://localhost:3000/reports/${report.id}">see report</a>`,
            });
            // Send email to the station managet
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: stationManagers?.email,
                subject: 'A new report has been approved',
                text: `Hello ${manager.name},\n\nA new report from ${user.name} has been approved.\n\ station (${report.nameOfStation}) - school (${report.nameOfSchool}) type of report ${report.inspections[0].name}.\n\ <a href="http://localhost:3000/reports/${report.id}">see report</a>`,
            });
        } else {
            // Send email to the officer with the rejection reason
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Your report has been rejected',
                text: `Hello ${user.name},\n\nYour report has been rejected for the following reason:\n\n${rejectionReason}\n\.station (${report.nameOfStation}) - school (${report.nameOfSchool}) type of report ${report.inspections[0].name}.\n\ <a href="http://localhost:3000/reports/${report.id}">see report</a>`,
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

    } catch (error) {
        console.error('Error getting report:', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}