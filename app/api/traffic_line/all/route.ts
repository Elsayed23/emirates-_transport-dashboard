import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const trafficLines = await db.trafficLine.findMany({
            select: {
                countOfStudents: true
            }
        })

        const countOfStudents = trafficLines.map(({ countOfStudents }) => countOfStudents).reduce((curr, acc) => curr + acc)

        return NextResponse.json({ trafficLinesCount: trafficLines.length, countOfStudents })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}