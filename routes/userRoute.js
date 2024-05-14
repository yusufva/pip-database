import express from "express";
import userService from "../services/userService.js";

let router = express.Router();

router.get("/", async (req, res) => {
    const koordinators = await userService.getUserByAspirator(11);
    res.status(koordinators.statusCode).send(koordinators);
});

export default router;
