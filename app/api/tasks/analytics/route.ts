import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        const totalTasks = await db.task.count({
            where: {
                userId: userId,
            },
        });

        const completedTasks = await db.task.count({
            where: {
                userId: userId,
            },
        });

        const pendingTasks = totalTasks - completedTasks;

        return NextResponse.json({
            totalTasks,
            completedTasks,
            pendingTasks,
        });
    } catch (error) {
        console.error("[tasks/analytics] error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
