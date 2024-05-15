import express from "express";
import userService from "../services/userService.js";

import jwtauth from "../middleware/jwtauth.js";

let router = express.Router();

router.get("/", async (req, res) => {
    const koordinators = await userService.getUserByAspirator(req.id);
    res.status(koordinators.statusCode).send(koordinators);
});

router.get("/aspirator", async (req, res) => {
    const aspirators = await userService.getAllAspirator();
    res.status(aspirators.statusCode).json(aspirators);
});

export default router;
