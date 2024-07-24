import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const inspectionTypes = await db.inspectionType.findMany();


        return NextResponse.json(inspectionTypes);

    } catch (error) {
        console.error('Error fetching inspection types:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
