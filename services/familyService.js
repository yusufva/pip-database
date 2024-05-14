import { Prisma, PrismaClient } from "@prisma/client";
import httpRespondsMessage from "../helper/httpRespondsMessage.js";

const prisma = new PrismaClient();

async function getAll(name, role) {
    const findPayload = {
        include: {
            student: {
                select: {
                    studentInfo: true,
                },
            },
            status: true,
        },
    };
    role == 1
        ? (findPayload.where = {
              student: {
                  some: {
                      studentInfo: {
                          aspirator: name,
                      },
                  },
              },
          })
        : (findPayload.where = {
              student: {
                  some: {
                      studentInfo: {
                          koordinator: name,
                      },
                  },
              },
          });
    const families = await prisma.familyMember.findMany(findPayload);
    return families.length < 1
        ? httpRespondsMessage.notFound("student data not found")
        : httpRespondsMessage.getSuccess("success retrieve data", families);
}

async function getByStudent(nisn) {
    const family = await prisma.familyMember.findMany({
        where: {
            student: {
                some: {
                    studentNisn: nisn,
                },
            },
        },
        include: {
            status: true,
            student: {
                select: {
                    studentInfo: true,
                },
            },
        },
    });
    return family.length < 1
        ? httpRespondsMessage.notFound("data not found")
        : httpRespondsMessage.getSuccess("success retrieve data", family);
}

async function getByFamilyNik(nik) {
    const family = await prisma.familyMember.findUnique({
        where: {
            nik: nik,
        },
        include: {
            status: true,
            student: {
                select: {
                    studentInfo: true,
                },
            },
        },
    });
    return family
        ? httpRespondsMessage.getSuccess("success retrieve data", family)
        : httpRespondsMessage.notFound("data not found");
}

export default {
    getAll,
    getByStudent,
    getByFamilyNik,
};
