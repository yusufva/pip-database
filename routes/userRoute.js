import express from "express";
import userService from "../services/userService.js";

import jwtauth from "../middleware/jwtauth.js";

let router = express.Router();

router.get("/", async (req, res) => {
    const koordinators = await userService.getUserByAspirator(req.id);
    res.status(koordinators.statusCode).send(koordinators);
});

export default router;
