import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { format } from 'date-fns';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;

        if (!id) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        // جلب المهام الخاصة بالضابط
        const tasks = await db.task.findMany({
            where: {
                userId: id,
            },
            select: {
                name: true,
                taskCount: true,
                completedCount: true,
                scheduledFor: true,
                note: true
            }
        });

        // تحليل المهام حسب الشهر
        const analyticsByMonth = tasks.reduce((acc: any, task: any) => {
            const month = format(new Date(task.scheduledFor), 'MMMM yyyy');
            if (!acc[month]) {
                acc[month] = {
                    totalTasks: 0,
                    completedTasks: 0,
                    pendingTasks: 0,
                    tasks: [] // تأكد من إضافة المهام نفسها هنا
                };
            }
            acc[month].totalTasks += task.taskCount;
            acc[month].completedTasks += task.completedCount;
            acc[month].pendingTasks += task.taskCount - task.completedCount;
            acc[month].tasks.push(task); // إضافة المهمة إلى الشهر المناسب
            return acc;
        }, {});

        return NextResponse.json(analyticsByMonth);
    } catch (error) {
        console.error("[safety-officer/monthly_analytics] error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};