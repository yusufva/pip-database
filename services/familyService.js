import { Prisma, PrismaClient } from "@prisma/client";
import httpRespondsMessage from "../helper/httpRespondsMessage.js";

const prisma = new PrismaClient();

async function getAll() {
    const families = await prisma.family.findMany({
        include: {
            member: true,
            student: true,
        },
    });
    return httpRespondsMessage.getSuccess("success retrieve data", families);
}

async function getByKK(kk) {
    const family = await prisma.family.findUnique({
        where: {
            nokk: kk,
        },
        include: {
            member: true,
            student: true,
        },
    });
    return httpRespondsMessage.getSuccess("success retrieve data", family);
}

async function create(payload) {
    try {
        const member = {
            nik: payload.member.nik,
            nama: payload.member.nama,
            nokk: payload.nokk,
            statusId: payload.member.statusId,
            anakKe: payload.member.anakKe,
            kotaLahir: payload.member.kotaLahir,
            ttl: payload.member.ttl,
        };
        const family = await prisma.family.create({
            data: {
                nokk: payload.nokk,
                member: {
                    createMany: {
                        data: member,
                    },
                },
            },
            include: {
                member: true,
                student: true,
            },
        });
        return httpRespondsMessage.created("family data created", family);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === "P2002") {
                return httpRespondsMessage.conflict(
                    "data in this kk number already exists"
                );
            }
        }
    }
}

export default {
    getAll,
    getByKK,
    create,
};
