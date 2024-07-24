import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params


        const reports = await db.report.findMany({
            where: {
                user_id: id
            },
            include: {
                inspections: true,
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                inspectionType: true
            }
        })

        if (!reports) {
            return NextResponse.json({ message: 'Not found user with this id' }, { status: 404 });
        }


        return NextResponse.json(reports)


    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
