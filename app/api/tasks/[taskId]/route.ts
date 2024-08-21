import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
    try {
        const { taskId } = await req.json();

        // العثور على المهمة وتحديث عداد المهام المكتملة
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
                    increment: 1  // زيادة عدد المهام المكتملة بواحد
                },
            }
        });

        // تحقق إذا كان `completedCount` الآن يساوي `taskCount`
        const updatedTask = await db.task.findUnique({
            where: { id: taskId }
        });

        if (updatedTask && updatedTask.completedCount >= updatedTask.taskCount) {
            // المهمة مكتملة
            // هنا يمكنك تحديد ما تريد القيام به بعد اكتمال المهمة، مثل إرسال إشعار
            return NextResponse.json({ message: 'Task completed successfully' });
        }

        return NextResponse.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error("[tasks] error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
