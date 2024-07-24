import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    try {

        await prisma.inspectionType.createMany({
            data: [
                {
                    name: 'Inspection of safety procedures on school buses'
                },
                {
                    name: 'Inspection of safety procedures in buildings'
                },
                {
                    name: 'Inspection of electronic control'
                }
            ]
        })

        await prisma.user.createMany({
            data: [
                {
                    name: 'bani_yas',
                    stationId: 1,
                    email: 'abdalhameed9801@gmail.com',
                    password: '12345',
                },
                {
                    name: 'حميد سلطان',
                    email: 'elsayedkewan123@gmail.comelsayedkewan123@gmail.com',
                    password: '12345',
                },
            ]
        })

        await prisma.role.createMany({
            data: [
                {
                    name: 'SAFETY_OFFICER',
                },
                {
                    name: 'STATION',
                },
                {
                    name: 'ADMIN',
                },
            ]
        })


        console.log(`Database has been seeded. 🌱`);
    }
    catch (error) {
        throw error;
    }
}

main().catch((err) => {
    console.warn("Error While generating Seed: \n", err);
});
