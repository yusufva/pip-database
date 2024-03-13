import { Prisma, PrismaClient } from "@prisma/client";
import httpRespondsMessage from "../helper/httpRespondsMessage";

const prisma = new PrismaClient();

async function getAll() {
    const students = await prisma.student.findMany({
        include: {
            family: {
                include: {
                    member: true,
                },
            },
        },
    });
    return (
        httpRespondsMessage.getSuccess("success retrieve data", students) ||
        httpRespondsMessage.getSuccess("success retrieve data", [])
    );
}

async function getById(id) {
    const student = await prisma.student.findUnique({
        where: {
            id: id,
        },
        include: {
            family: {
                include: {
                    member: true,
                },
            },
        },
    });
    return student
        ? httpRespondsMessage.getSuccess("success retrieve data", student)
        : httpRespondsMessage.notFound("student not found");
}

async function create(payload) {
    try {
        const student = await prisma.student.create({
            data: payload,
            include: {
                family: {
                    include: {
                        member: true,
                    },
                },
            },
        });
        return httpRespondsMessage.created("student created", student);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === "P2002") {
                return httpRespondsMessage.conflict(
                    "data in this periods already exists"
                );
            }
        }
    }
}

async function update(id, payload) {
    let student = await prisma.student.findFirst({
        where: {
            id: id,
        },
    });
    if (!student) return httpRespondsMessage.notFound("student not found");
    student = prisma.student.update({
        where: {
            id: id,
        },
        data: payload,
        include: {
            family: {
                include: {
                    member: true,
                },
            },
        },
    });
    return httpRespondsMessage.getSuccess("success retrieve data", student);
}

async function deleteById(id) {
    let student = await prisma.student.findFirst({
        where: {
            id: id,
        },
    });
    if (!student) return httpRespondsMessage.notFound("student not found");
    student = await prisma.student.delete({
        where: {
            id: id,
        },
        include: {
            family: {
                include: {
                    member: true,
                },
            },
        },
    });
    return httpRespondsMessage.deleteSuccess("student deleted");
}

export default {
    getAll,
    getById,
    create,
    update,
    delete: deleteById,
};
