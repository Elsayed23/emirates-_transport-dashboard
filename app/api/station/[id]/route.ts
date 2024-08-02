import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params


        const station = await db.station.findFirst({
            where: {
                id
            },
            include: {
                schools: {
                    include: {
                        _count: true,
                    }
                }
            }
        })


        return NextResponse.json(station)


    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}