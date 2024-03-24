import express from "express";
import { statusCode } from "http-status-codes";
import familyService from "../services/familyService.js";
import httpRespondsMessage from "../helper/httpRespondsMessage.js";

var router = express.Router();

router.get("/", async (req, res) => {
    const families = await familyService.getAll();
    res.send(
        httpRespondsMessage.getSuccess("success retrieve data", families) ||
            httpRespondsMessage.getSuccess("success retrieve data", [])
    );
});

router.get("/:kk", async (req, res) => {
    const noKK = atob(req.params.kk);
    const family = await familyService.getByKK(noKK);
    if (!family) return res.status(statusCode.NOT_FOUND).send(family);
    res.send(family);
});

router.post("/", async (req, res) => {
    const family = await familyService.create(req.body);
    if (family.statusCode == statusCode.CONFLICT)
        return res.status(statusCode.CONFLICT).send(family);
    res.send(family);
});

export default router;
