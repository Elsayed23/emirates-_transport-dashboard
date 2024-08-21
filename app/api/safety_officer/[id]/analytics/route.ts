import { db } from "@/lib/db";
import { addMonths, differenceInDays } from "date-fns";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        // Fetch tasks for the officer related to TaskEnum
        const tasks: any = await db.task.findMany({
            where: {
                userId: id,
                name: {
                    in: ['TRAFFIC_LINE_HAZARDS', 'BUILDINGS_HAZARDS', 'ELECTRONIC_SURVEILLANCE_REPORT', 'BUILDINGS_REPORT', 'BUSES_REPORT'],
                },
            },
        });

        // Calculate the remaining days and completion percentage for each task
        const tasksWithDetails = tasks.map((task: any) => {
            let remainingDays = 0;
            let deadline = null;
            let completionPercentage = 0;

            if (task.frequency === 'MONTHLY') {
                deadline = addMonths(new Date(task.scheduledFor), 1);
                remainingDays = differenceInDays(deadline, new Date());
                completionPercentage = (task.completedCount / task.taskCount) * 100;
            }

            return {
                ...task,
                remainingDays,
                deadline,
                completionPercentage,
            };
        });

        return NextResponse.json({ tasks: tasksWithDetails });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};