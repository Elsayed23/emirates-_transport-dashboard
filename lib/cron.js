import cron from 'node-cron';
import { db } from './lib/db';
import { addMonths } from 'date-fns';

// تحميل المهام الشهرية في بداية كل شهر
cron.schedule('0 0 1 * *', async () => {
    try {
        const safetyOfficers = await db.user.findMany({
            where: {
                role: {
                    name: 'SAFETY_OFFICER',
                },
            },
        });

        const tasks = safetyOfficers.map(officer => ({
            userId: officer.id,
            name: 'MONTHLY_SAFETY_CHECK',
            frequency: 'MONTHLY',
            taskCount: 1,
            completedCount: 0,
            scheduledFor: addMonths(new Date(), 0), // تعيين المهمة للشهر الحالي
            note: 'Monthly safety check tasks',
        }));

        await db.task.createMany({ data: tasks });

        console.log('Monthly safety tasks have been loaded for all safety officers');
    } catch (error) {
        console.error('Error loading monthly tasks:', error);
    }
});
