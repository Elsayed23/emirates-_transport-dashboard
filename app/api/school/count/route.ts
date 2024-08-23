import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async () => {
    try {

        const schoolsCount = await db.school.count()

        return NextResponse.json({ schoolsCount })

    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}