import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// إضافة مهمة جديدة
export const POST = async (req: Request) => {
    try {
        const { user_id, name, frequency, taskCount, note } = await req.json();

        const taskData = {
            userId: user_id,
            name,
            frequency,
            taskCount: parseInt(taskCount),
            completedCount: 0,
            note,
            scheduledFor: new Date(),
        };

        const newTask = await db.task.create({ data: taskData });

        return NextResponse.json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.error("[tasks] error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

// تحديث عدد المهام المكتملة
export const PATCH = async (req: Request) => {
    try {
        const { taskId } = await req.json();

        const task = await db.task.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            return new NextResponse('Task not found', { status: 404 });
        }

        await db.task.update({
            where: { id: taskId },
            data: {
                completedCount: {
                    increment: 1
                },
            }
        });

        return NextResponse.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error("[tasks] error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
