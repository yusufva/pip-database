import express from "express";
import userService from "../services/userService.js";

import jwtauth from "../middleware/jwtauth.js";

let router = express.Router();

router.post("/login", async (req, res) => {
    const login = await userService.login(req.body);
    res.status(login.statusCode).send(login);
});

router.post("/register", async (req, res) => {
    const register = await userService.register(req.body);
    res.status(register.statusCode).send(register);
});

router.put("/password/:id", jwtauth.verifyToken(), async (req, res) => {
    const resetPassword = await userService.resetPassword(
        parseInt(req.params.id),
        req.id,
        req.body
    );
    res.status(resetPassword.statusCode).send(resetPassword);
});

export default router;
