import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpRespondsMessage from "../helper/httpRespondsMessage.js";

const prisma = new PrismaClient();

async function login(loginPayload) {
    const user = await prisma.user.findFirstOrThrow({
        where: { email: loginPayload.email },
    });
    const isValid = await bcrypt.compare(loginPayload.password, user.password);
    if (!isValid)
        return httpRespondsMessage.badRequest("invalid email or password");
    const userId = user.id;
    const name = user.name;
    const role = user.role;
    const aspirator = user.aspirator;
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
        await prisma.user.create({
            data: {
                name: registerPayload.name,
                username: registerPayload.username,
                password: hashPassword,
                role_id: registerPayload.role_id,
                aspirator: registerPayload.aspirator,
            },
        });
        return httpRespondsMessage.created("success register user");
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return httpRespondsMessage.conflict(
                    "data in this email already exists"
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
    login,
    register,
    resetPassword,
};
