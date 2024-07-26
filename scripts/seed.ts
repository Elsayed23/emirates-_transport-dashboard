const { PrismaClient } = require('@prisma/client')
require('dotenv').config()  // Add this line to load environment variables

const database = new PrismaClient();


const main = async () => {
    try {

        await database.inspectionType.createMany({
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

        await database.user.createMany({
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

        await database.role.createMany({
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
