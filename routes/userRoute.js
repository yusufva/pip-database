import express from "express";
import userService from "../services/userService.js";

let router = express.Router();

router.get("/", async (req, res) => {
    const koordinators = await userService.getUserByAspirator(req.id, req.role);
    res.status(koordinators?.statusCode).send(koordinators);
});

router.get("/aspirator", async (req, res) => {
    const aspirators = await userService.getAllAspirator();
    res.status(aspirators?.statusCode).json(aspirators);
});

router.get("/statistics", async (req, res) => {
    const statistics = await userService.getStatistics();
    res.status(statistics?.statusCode).json(statistics);
});

export default router;
