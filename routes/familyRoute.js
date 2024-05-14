import express from "express";
import { StatusCodes } from "http-status-codes";
import familyService from "../services/familyService.js";
import jwtauth from "../middleware/jwtauth.js";

var router = express.Router();

router.get("/", async (req, res) => {
    const families = await familyService.getAll(req.name, req.role);
    res.status(families.statusCode).send(families);
});

router.get("/:nisn", jwtauth.verifyToken(), async (req, res) => {
    const nisn = req.params.nisn;
    const family = await familyService.getByStudent(nisn);
    res.status(family.statusCode).send(family);
});

router.get("/member/:nik", async (req, res) => {
    const nik = req.params.nik;
    const family = await familyService.getByFamilyNik(nik);
    res.status(family.statusCode).json(family);
});

// router.post("/", async (req, res) => {
//     const family = await familyService.create(req.body);
//     if (family.statusCode == StatusCodes.CONFLICT)
//         return res.status(StatusCodes.CONFLICT).send(family);
//     res.status(family.statusCode).send(family);
// });

export default router;
