import { Prisma, PrismaClient } from "@prisma/client";
import httpRespondsMessage from "../helper/httpRespondsMessage.js";

const prisma = new PrismaClient();

async function getAll() {
    const students = await prisma.student.findMany({
        include: {
            family: {
                include: {
                    familyMember: true,
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
                    familyMember: true,
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
        const members = [];
        payload.familyMember.map((member) => {
            const data = {
                familyMemberNik: member.nik,
            };
            members.push(data);
        });
        // payload.familyMember.map((member) => {
        //     member.ttl = new Date(member.ttl);
        // });
        // const members = [];
        // payload.familyMember.map((member) => {
        //     const data = {
        //         familyMemberInfo: {
        //             create: member,
        //         },
        //     };
        //     members.push(data);
        // });
        const student = await prisma.student.create({
            data: {
                nisn: payload.nisn,
                nama: payload.nama,
                sekolah: payload.sekolah,
                provinsiSekolah: payload.provinsi,
                kotaSekolah: payload.kota,
                kecamatanSekolah: payload.kecamatan,
                kelas: payload.kelas,
                rombel: payload.rombel,
                semester: payload.semester,
                jenjang: payload.jenjang,
                bentuk: payload.bentuk,
                kelamin: payload.kelamin,
                tempatLahir: payload.tempatLahir,
                tanggalLahir: new Date(payload.tanggalLahir),
                fase: payload.fase,
                nik: payload.nik,
                koordinator: payload.koordinator,
                aspirator: payload.aspirator,
                family: {
                    create: members,
                },
            },
            include: {
                family: {
                    include: {
                        familyMemberInfo: true,
                    },
                },
            },
        });
        // return student;
        return httpRespondsMessage.created("student created", student);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === "P2002") {
                console.log(e);
                return httpRespondsMessage.conflict(
                    "data in this periods already exists"
                );
            }
            return httpRespondsMessage.internalServerError(e.message);
        }
        return httpRespondsMessage.internalServerError(e);
    }
}

async function createWithFam(payload) {
    try {
        payload.familyMember.map((member) => {
            member.ttl = new Date(member.ttl);
        });
        const members = [];
        payload.familyMember.map((member) => {
            const data = {
                familyMemberInfo: {
                    create: member,
                },
            };
            members.push(data);
        });
        // members.map((mmbr) => {
        //     console.log(mmbr);
        // });
        // // return console.log(members[0].familyMemberInfo.create);
        const student = await prisma.student.create({
            data: {
                nisn: payload.nisn,
                nama: payload.nama,
                sekolah: payload.sekolah,
                provinsiSekolah: payload.provinsi,
                kotaSekolah: payload.kota,
                kecamatanSekolah: payload.kecamatan,
                kelas: payload.kelas,
                rombel: payload.rombel,
                semester: payload.semester,
                jenjang: payload.jenjang,
                bentuk: payload.bentuk,
                kelamin: payload.kelamin,
                tempatLahir: payload.tempatLahir,
                tanggalLahir: new Date(payload.tanggalLahir),
                fase: payload.fase,
                nik: payload.nik,
                koordinator: payload.koordinator,
                aspirator: payload.aspirator,
                family: {
                    create: members,
                },
            },
            include: {
                family: {
                    include: {
                        familyMemberInfo: true,
                    },
                },
            },
        });

        return httpRespondsMessage.created(
            "success create student with family",
            student
        );
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === "P2002") {
                return httpRespondsMessage.conflict(
                    "data in this periods already exists"
                );
            }
        }

        if (e instanceof Prisma.PrismaClientValidationError) {
            // Extract error message from Prisma client validation error
            const errorMessage = e.message || "Validation error occurred";

            return httpRespondsMessage.badRequest(errorMessage);
        }

        return httpRespondsMessage.internalServerError(e);
    }
}

async function update(excel) {
    try {
        await excel.map(async (data) => {
            let student = await prisma.student.findFirst({
                where: {
                    AND: [
                        {
                            nisn: data.nisn,
                        },
                        {
                            fase: data.fase,
                        },
                    ],
                },
                include: {
                    family: {
                        include: {
                            member: true,
                        },
                    },
                },
            });
            if (!student) return null;
            const id = student.id;
            student = await prisma.student.update({
                where: {
                    id: id,
                },
                data: {
                    nama: data.namasiswa,
                    sekolah: data.namasekolah,
                    provinsiSekolah: data.provinsi,
                    kotaSekolah: data["kota/kabupaten"],
                    kecamatanSekolah: data.kecamatan,
                    npsn: data.npsn,
                    kelas: data.kelas,
                    rombel: data.rombel,
                    semester: data.semester,
                    jenjang: data.jenjang,
                    bentuk: data.bentuk,
                    kelamin: data.kelamin,
                    nominal: data.nominal,
                    tipeSk: data.tipesk,
                    skNominasi: data.nomorsknominasi,
                    tanggalSkNominasi: data.tanggalsknominasi,
                    tahapNominasi: data.tahapnominasi,
                    vaNominasi: data.virtualaccountnominasi,
                    noRek: data["no.rekening"],
                    bank: data.bank,
                    layakPip: data.layakpip == "1" ? 1 : 0,
                    fase: data.fase,
                    keteranganTahap: data.keterangantahap,
                    keteranganPencairan: data.keteranganpencairan,
                    status: "SK TERBIT",
                },
                include: {
                    family: {
                        include: {
                            member: true,
                        },
                    },
                },
            });
        });

        return httpRespondsMessage.getSuccess("success update data");
    } catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            // Extract error message from Prisma client validation error
            const errorMessage = err.message || "Validation error occurred";

            return httpRespondsMessage.badRequest(errorMessage);
        }

        return httpRespondsMessage.internalServerError(err.message);
    }
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
    createWithFam,
    update,
    delete: deleteById,
};
