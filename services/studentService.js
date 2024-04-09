import { Prisma, PrismaClient } from "@prisma/client";
import httpRespondsMessage from "../helper/httpRespondsMessage.js";

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
                nokk: payload.nokk,
                pic: payload.pic,
            },
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

async function createWithFam(payload) {
    try {
        payload.familyMember.map((member) => {
            member.ttl = new Date(member.ttl);
        });
        const student = await prisma.family.create({
            data: {
                nokk: payload.nokk,
                member: {
                    createMany: {
                        data: payload.familyMember,
                    },
                },
                student: {
                    create: {
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
                        pic: payload.pic,
                    },
                },
            },
            include: {
                member: true,
                student: true,
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
    // const path = "./public/uploads/" + file.filename;

    // const workbook = new exceljs.Workbook();
    // workbook.xlsx
    //     .readFile(path)
    //     .then((excelFile) => {
    //         const worksheet = excelFile.worksheets[0];
    //         const excelData = [];
    //         const header = [];

    //         worksheet.getRow(1).eachCell((cell, colNumber) => {
    //             header[colNumber] = cell.value
    //                 .replaceAll(" ", "")
    //                 .toLowerCase();
    //         });

    //         worksheet.eachRow((row, index) => {
    //             if (index > 1) {
    //                 const rowData = {};
    //                 row.eachCell((cell, colNumber) => {
    //                     rowData[`${header[colNumber]}`] = cell.value;
    //                 });
    //                 excelData.push(rowData);
    //             }
    //         });

    try {
        excel.map(async (data) => {
            let student = await prisma.student.findFirst({
                where: {
                    nisn: data.nisn,
                },
            });

            if (!student) return null;
            student = prisma.student.update({
                where: {
                    nisn: data.nisn,
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
                    layakPip: data.layakpip,
                    fase: data.fase,
                    keteranganTahap: data.keterangantahap,
                    keteranganPencairan: data.keteranganpencairan,
                    status: data.status,
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
        return httpRespondsMessage.internalServerError("failed update data");
    }

    // })
    // .catch((err) => {
    //     unlink(path, (err) => {
    //         if (err) throw err;
    //     });
    //     return httpRespondsMessage.internalServerError(
    //         "internal server error"
    //     );
    // });

    return httpRespondsMessage.getSuccess("success update data");
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
