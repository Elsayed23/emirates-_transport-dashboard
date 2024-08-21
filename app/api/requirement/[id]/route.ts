import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    { params }: { params: { id: string } }
) => {

    const { id } = params

    try {

        const requirements = await db.requirement.findMany({
            where: {
                inspectionTypeId: id,
            },
            include: {
                notes: true,
            },
        });

        return NextResponse.json(requirements);
    } catch (error) {
        console.error('Error fetching requirements:', error);
        return NextResponse.json({ message: 'Failed to fetch requirements' });
    }
}