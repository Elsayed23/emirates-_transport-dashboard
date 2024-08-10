import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
    req: Request
) => {
    try {

        const { user_id } = await req.json()

        await db.user.update({
            data: {
                approved: true
            },
            where: {
                id: user_id
            }
        })

        return NextResponse.json({ message: 'Approved successfully' })



    } catch (error) {
        console.log("[instruments]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}                                                                                                                             
