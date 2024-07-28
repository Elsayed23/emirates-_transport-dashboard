import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
const nodemailer = require('nodemailer');


export async function POST(req: NextRequest) {
    try {
        const { inspectionId, reason } = await req.json();

        if (!inspectionId || !reason) {
            return NextResponse.json({ message: 'Inspection ID and reason are required' }, { status: 400 });
        }

        await db.deleteRequest.create({
            data: {
                inspectionId,
                reason,
            },
        });

        // Send email to admin
        const transporter = nodemailer.createTransport({
            service: 'gmail', // e.g., use your email service
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Delete Request',
            text: `A new delete request has been made for inspection ID: ${inspectionId}. Reason: ${reason}`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Delete request created successfully and email sent to admin' });
    } catch (error) {
        console.error('Error creating delete request:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
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
        const { requestId, action, rejectionReason } = await req.json(); // action can be 'APPROVE' or 'REJECT'

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
            include: { inspection: { include: { report: { include: { user: true } } } } }, // include related user
        });

        if (action === 'APPROVE') {
            // First delete the DeleteRequest
            await db.deleteRequest.deleteMany({
                where: { inspectionId: deleteRequest.inspectionId }
            });

            // Delete the inspection if approved
            await db.inspection.delete({
                where: { id: deleteRequest.inspectionId },
            });
        } else if (action === 'REJECT') {
            // Send email to officer
            const transporter = nodemailer.createTransport({
                service: 'gmail', // e.g., use your email service
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: deleteRequest.inspection.report.user.email,
                subject: 'Delete Request Rejected',
                text: `Your delete request for inspection ID: ${deleteRequest.inspectionId} has been rejected. Reason: ${rejectionReason}`,
            };

            await transporter.sendMail(mailOptions);
        }

        return NextResponse.json({ message: `Request ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully`, data: deleteRequest });
    } catch (error) {
        console.error(`Error processing request:`, error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
