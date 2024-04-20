import express from "express";
import { StatusCodes } from "http-status-codes";
import userService from "../services/userService.js";
import httpRespondsMessage from "../helper/httpRespondsMessage.js";

let router = express.Router();

router.post("/login", async (req, res) => {
    const login = await userService.login(req.body);
    if (login.statusCode == StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST).send(login);
    res.send(login);
});

router.post("/register", async (req, res) => {
    const register = await userService.register(req.body);
    if (register.statusCode == StatusCodes.CONFLICT)
        return res.status(StatusCodes.CONFLICT).send(register);
    if (register.statusCode == StatusCodes.INTERNAL_SERVER_ERROR)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(register);
    res.send(register);
});

router.put("/password", async (req, res) => {
    const resetPassword = await userService.resetPassword(req.body);
    res.status(resetPassword.statusCode).send(resetPassword);
});

export default router;
