import { Prisma, PrismaClient } from "@prisma/client";
import httpRespondsMessage from "../helper/httpRespondsMessage.js";

const prisma = new PrismaClient();

async function getAll(nama, role) {
    const findPayload = {
        include: {
            family: {
                include: {
                    familyMemberInfo: true,
                },
            },
        },
    };
    role == 1
        ? (findPayload.where = { aspirator: nama })
        : (findPayload.where = { koordinator: nama });
    const students = await prisma.student.findMany(findPayload);
    return (
        httpRespondsMessage.getSuccess("success retrieve data", students) ||
        httpRespondsMessage.getSuccess("success retrieve data", [])
    );
}

async function getById(id, nama, roleid) {
    const student = await prisma.student.findUnique({
        where: {
            id: id,
        },
        include: {
            family: {
                include: {
                    familyMemberInfo: true,
                },
            },
        },
    });
    if (roleid == 1) {
        if (student.aspirator != nama)
            return httpRespondsMessage.unauthorized(
                "you can't get another aspirator data"
            );
    } else if (roleid == 2) {
        if (student.koordinator != nama)
            return httpRespondsMessage.unauthorized(
                "you can't get another koordinator data"
            );
    }
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
                tanggalLahir:
                    payload.ttl == null ? null : new Date(payload.tanggalLahir),
                fase: payload.fase,
                nik: payload.nik,
                status: "DIDAFTARKAN",
                koordinator: payload.koordinator,
                aspirator: payload.aspirator,
                pic: payload.pic,
                keteranganTambahan: payload.keteranganTambahan,
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
            member.ttl != null
                ? (member.ttl = new Date(member.ttl))
                : (member.ttl = null);
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
                tanggalLahir:
                    payload.ttl == null ? null : new Date(payload.tanggalLahir),
                fase: payload.fase,
                nik: payload.nik,
                status: "DIDAFTARKAN",
                koordinator: payload.koordinator,
                aspirator: payload.aspirator,
                pic: payload.pic,
                keteranganTambahan: payload.keteranganTambahan,
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
                            familyMemberInfo: true,
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
                    created_at: new Date(Date.now()),
                },
                include: {
                    family: {
                        include: {
                            familyMemberInfo: true,
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

async function edit(id, payload, name, role) {
    let student = await prisma.student.findFirst({
        where: {
            id: id,
        },
    });
    if (!student) return httpRespondsMessage.notFound("student not found");

    if (role == 1) {
        if (student.aspirator != name)
            return httpRespondsMessage.unauthorized(
                "you are not authorized to delete this student"
            );
    } else if (role == 2) {
        if (student.koordinator != name)
            return httpRespondsMessage.unauthorized(
                "you are not authorized to delete this student"
            );
    }

    const err = [];

    payload.familyMember.map(async (member) => {
        try {
            let family = await prisma.familyMember.findFirst({
                where: { nik: member.nik },
            });
            if (!family) return err.push("family not found");
            family = await prisma.familyMember.update({
                where: {
                    nik: member.nik,
                },
                data: {
                    nama: member.nama,
                    statusId: member.statusId,
                    ttl: member.ttl,
                    provinsi: member.provinsi,
                    kota: member.kota,
                    kecamatan: member.kecamatan,
                    kelurahan: member.kelurahan,
                    kodepos: member.kodepos,
                    alamat: member.alamat,
                    hp: member.hp,
                },
            });
        } catch (e) {
            return err.push(e);
        }
    });

    student = await prisma.student.update({
        where: {
            id: id,
        },
        data: {
            nik: payload.nik,
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
            fase: payload.fase,
            tempatLahir: payload.tempatLahir,
            tanggalLahir: payload.tanggalLahir,
            koordinator: payload.koordinator,
            aspirator: payload.aspirator,
            pic: payload.pic,
            keteranganTambahan: payload.keteranganTambahan,
            updated_at: new Date(Date.now()),
        },
        include: {
            family: {
                include: {
                    familyMemberInfo: true,
                },
            },
        },
    });
    return httpRespondsMessage.getSuccess("success update data", {
        err,
        student,
    });
}

async function status(id, status, name, role) {
    let student = await prisma.student.findFirst({
        where: {
            id: id,
        },
    });
    if (!student) return httpRespondsMessage.notFound("student not found");

    if (role == 1) {
        if (student.aspirator != name)
            return httpRespondsMessage.unauthorized(
                "you are not authorized to edit this student"
            );
    } else if (role == 2) {
        if (student.koordinator != name)
            return httpRespondsMessage.unauthorized(
                "you are not authorized to edit this student"
            );
    }

    student = await prisma.student.update({
        where: {
            id: id,
        },
        data: {
            status: status.name,
            keteranganTambahan: status.keteranganTambahan,
            updated_at: new Date(Date.now()),
        },
    });

    return httpRespondsMessage.getSuccess("success update status");
}

async function deleteById(id, name, role) {
    let student = await prisma.student.findFirst({
        where: {
            id: id,
        },
    });
    if (!student) return httpRespondsMessage.notFound("student not found");
    if (role == 1) {
        if (student.aspirator != name)
            return httpRespondsMessage.unauthorized(
                "you are not authorized to delete this student"
            );
    } else if (role == 2) {
        if (student.koordinator != name)
            return httpRespondsMessage.unauthorized(
                "you are not authorized to delete this student"
            );
    }
    student = await prisma.student.delete({
        where: {
            id: id,
        },
        include: {
            family: {
                include: {
                    familyMemberInfo: true,
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
    edit,
    status,
    delete: deleteById,
};
