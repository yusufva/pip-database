import express from "express";
import userService from "../services/userService.js";

let router = express.Router();

router.post("/login", async (req, res) => {
    const login = await userService.login(req.body);
    res.status(login.statusCode).send(login);
});

router.post("/register", async (req, res) => {
    const register = await userService.register(req.body);
    res.status(register.statusCode).send(register);
});

router.put("/password", async (req, res) => {
    const resetPassword = await userService.resetPassword(req.body);
    res.status(resetPassword.statusCode).send(resetPassword);
});

export default router;
