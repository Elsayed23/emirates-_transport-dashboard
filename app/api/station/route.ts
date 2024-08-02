import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {

        const { name, filterName, translationName } = await req.json()

        if (!name || !filterName || !translationName) {
            return NextResponse.json({ message: 'Missing required fields.' });
        }

        const station = await db.station.create({
            data: {
                name,
                filterName,
                translationName
            }
        })

        return NextResponse.json(station)

    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export const GET = async () => {
    try {

        const stations = await db.station.findMany({
            include: {
                _count: true
            }
        })

        return NextResponse.json(stations)

    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}