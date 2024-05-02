import express from "express";
import { StatusCodes } from "http-status-codes";
import familyService from "../services/familyService.js";
import httpRespondsMessage from "../helper/httpRespondsMessage.js";

var router = express.Router();

router.get("/", async (req, res) => {
    const families = await familyService.getAll();
    res.status(families.statusCode).send(families || []);
});

router.get("/:kk", async (req, res) => {
    const noKK = req.params.kk;
    const family = await familyService.getByKK(noKK);
    if (!family) return res.status(StatusCodes.NOT_FOUND).send(family);
    res.status(family.statusCode).send(family);
});

router.post("/", async (req, res) => {
    const family = await familyService.create(req.body);
    if (family.statusCode == StatusCodes.CONFLICT)
        return res.status(StatusCodes.CONFLICT).send(family);
    res.status(family.statusCode).send(family);
});

export default router;
