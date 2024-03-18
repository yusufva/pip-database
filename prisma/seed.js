import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function familyStatus() {
    const statusList = [
        {
            id: 1,
            status: "anak",
        },
        {
            id: 2,
            status: "ayah",
        },
        {
            id: 3,
            status: "ibu",
        },
        {
            id: 4,
            status: "wali",
        },
    ];

    for (let data of statusList) {
        await prisma.familyStatus.create({
            data: data,
        });
    }
}

familyStatus()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1);
    });
