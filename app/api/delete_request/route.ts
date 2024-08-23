import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other service you use
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { inspectionId, reason } = await req.json();

        if (!inspectionId || !reason) {
            return NextResponse.json({ message: 'Inspection ID and reason are required' }, { status: 400 });
        }

        const request = await db.deleteRequest.create({
            data: {
                inspectionId,
                reason,
            },
            include: { inspection: { include: { report: { include: { user: { select: { name: true } } } } } } },
        });

        const safetyManagers = await db.user.findMany({
            where: {
                role: {
                    name: 'SAFETY_MANAGER',
                },
            },
            select: {
                email: true,
                name: true,
            },
        });

        for (const safetyManager of safetyManagers) {
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: safetyManager.email,
                subject: 'New Delete Request',
                text: `Hello ${safetyManager.name},\n\nA new delete request has been made by ($${request.inspection.report.user?.name}).\n\ Reason: ${reason}`,
            });
        }

        return NextResponse.json({ message: 'Delete request created successfully and email sent to safety managers' });
    } catch (error) {
        console.error('Error creating delete request:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const deleteRequests = await db.deleteRequest.findMany({
            where: {
                status: 'PENDING',
            },
            include: {
                inspection: {
                    include: {
                        report: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(deleteRequests);
    } catch (error) {
        console.error('Error fetching delete requests:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { requestId, action, rejectionReason } = await req.json();

        if (!requestId || !action) {
            return NextResponse.json({ message: 'Request ID and action are required' }, { status: 400 });
        }

        type UpdateData = {
            status: string;
            rejectionReason?: string;
        };

        const updateData: UpdateData = { status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' };

        if (action === 'REJECT' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const deleteRequest = await db.deleteRequest.update({
            where: { id: requestId },
            data: updateData,
            include: { inspection: { include: { report: { include: { user: { select: { name: true, email: true } } } } } } },
        });

        if (action === 'APPROVE') {
            await db.deleteRequest.deleteMany({
                where: { inspectionId: deleteRequest.inspectionId }
            });

            await db.inspection.delete({
                where: { id: deleteRequest.inspectionId },
            });
        } else if (action === 'REJECT') {
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: deleteRequest.inspection.report.user?.email,
                subject: 'Delete Request Rejected',
                text: `Hello ${deleteRequest.inspection.report.user?.name},\n\nYour delete request for inspection ID: ${deleteRequest.inspectionId} has been rejected. Reason: ${rejectionReason}`,
            });
        }

        return NextResponse.json({ message: `Request ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully`, data: deleteRequest });
    } catch (error) {
        console.error(`Error processing request:`, error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
