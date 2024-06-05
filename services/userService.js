import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpRespondsMessage from "../helper/httpRespondsMessage.js";

const prisma = new PrismaClient();

async function getUserByAspirator(id, role) {
    const whereClause =
        role === 1 ? { aspiratorId: id, role_id: 2 } : { role_id: 2 };
    const user = await prisma.user.findMany({
        where: whereClause,
        select: {
            id: true,
            username: true,
            name: true,
            role: {
                select: {
                    id: true,
                    role_name: true,
                },
            },
            aspirator: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return httpRespondsMessage.getSuccess("success retrieve data", user);
}

async function getAllAspirator() {
    const user = await prisma.user.findMany({
        where: {
            role_id: 1,
        },
        select: {
            id: true,
            name: true,
            role: {
                select: {
                    role_name: true,
                },
            },
        },
    });
    return httpRespondsMessage.getSuccess("success retrieve data", user);
}

async function getStatistics() {
    const koordinator = await prisma.student.groupBy({
        by: ["koordinator"],
        _count: {
            koordinator: true,
        },
        orderBy: {
            koordinator: "asc",
        },
    });

    const aspirator = await prisma.student.groupBy({
        by: ["aspirator"],
        _count: {
            aspirator: true,
        },
        orderBy: {
            aspirator: "asc",
        },
    });

    const response = {
        aspirator: aspirator,
        koordinator: koordinator,
    };

    return httpRespondsMessage.getSuccess("success retrieve data", response);
}

async function login(loginPayload) {
    const user = await prisma.user.findFirst({
        where: { username: loginPayload.username },
        include: {
            aspirator: {
                select: {
                    name: true,
                },
            },
        },
    });
    if (!user) return httpRespondsMessage.notFound("this user doesn't exist");
    const isValid = await bcrypt.compare(loginPayload.password, user.password);
    if (!isValid)
        return httpRespondsMessage.badRequest("invalid email or password");
    const userId = user.id;
    const name = user.name;
    const role = user.role_id;
    const aspirator = user.aspiratorId == null ? null : user.aspirator.name;
    const accessToken = jwt.sign(
        { userId, name, role, aspirator },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3h" }
    );
    const refreshToken = jwt.sign(
        { userId, name, role, aspirator },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
    await prisma.user.update({
        data: { refresh_token: refreshToken },
        where: { id: userId },
    });
    return httpRespondsMessage.getSuccess("success login", {
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
}

async function register(registerPayload) {
    const salt = await bcrypt.genSalt(13);
    const hashPassword = await bcrypt.hash(registerPayload.password, salt);
    try {
        const userData = {
            name: registerPayload.name,
            username: registerPayload.username,
            password: hashPassword,
            role_id: registerPayload.role_id,
        };

        if (registerPayload.aspiratorId != null) {
            userData.aspiratorId = registerPayload.aspiratorId;
        }

        await prisma.user.create({
            data: userData,
        });
        return httpRespondsMessage.created("success register user");
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return httpRespondsMessage.conflict(
                    "data in this username already exists"
                );
            }
        }
        return httpRespondsMessage.internalServerError(e.message);
    }
}

async function resetPassword(id, userId, resetPayload) {
    let user = await prisma.user.findUnique({ where: { id: id } });
    if (userId != user.id)
        return httpRespondsMessage.unauthorized(
            "you can't change other account's password"
        );
    const salt = await bcrypt.genSalt(13);
    const newPassword = await bcrypt.hash(resetPayload.new_password, salt);
    user = await prisma.user.update({
        data: {
            password: newPassword,
        },
        where: {
            id: user.id,
        },
    });
    return httpRespondsMessage.getSuccess("success reset password");
}

export default {
    getUserByAspirator,
    getAllAspirator,
    getStatistics,
    login,
    register,
    resetPassword,
};
