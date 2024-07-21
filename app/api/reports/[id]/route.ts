import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params


        const report = await db.report.findFirst({
            where: {
                id
            },
            include: {
                inspections: true
            }
        })

        if (!report) {
            return NextResponse.json({ message: 'Not found report with this id' }, { status: 404 });
        }


        return NextResponse.json(report)


    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
