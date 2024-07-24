import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
const nodemailer = require("nodemailer");

export async function PATCH(req: Request) {
    try {
        const { inspectionId, rootCause } = await req.json();


        await db.inspection.update({
            where: {
                id: inspectionId
            },
            data: {
                rootCause
            }
        });

        return NextResponse.json({ message: 'Root cause added successfully' });
    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}