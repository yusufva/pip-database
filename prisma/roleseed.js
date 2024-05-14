import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function role() {
    const roleList = [
        {
            id: 99,
            role_name: "super user",
        },
        {
            id: 1,
            role_name: "aspirator",
        },
        {
            id: 2,
            role_name: "koordinator",
        },
    ];

    for (let data of roleList) {
        await prisma.role.create({
            data: data,
        });
    }
}

role()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1);
    });
