import express from "express";
import { StatusCodes } from "http-status-codes";
import studentService from "../services/studentService.js";
import { upload } from "../middleware/upload.js";
import excelParse from "../middleware/excelParse.js";

var router = express.Router();

router.get("/", async (req, res) => {
    const students = await studentService.getAll(req.name, req.role);
    res.send(students);
});
router.get("/:id", async (req, res) => {
    const student = await studentService.getById(
        parseInt(req.params.id),
        req.name,
        req.role
    );
    if (!student) return res.status(StatusCodes.NOT_FOUND).send(student);
    res.send(student);
});

router.post("/", async (req, res) => {
    const student = await studentService.create(req.body);
    if (student.statusCode == StatusCodes.CONFLICT)
        return res.status(StatusCodes.CONFLICT).send(student);
    res.status(student.statusCode).send(student);
});

router.post("/family", async (req, res) => {
    const student = await studentService.createWithFam(req.body);
    if (student.statusCode == StatusCodes.CONFLICT)
        return res.status(student.statusCode).send(student);
    res.status(student.statusCode).send(student);
});

router.post(
    "/excel",
    upload.single("excelFile"),
    excelParse,
    async (req, res) => {
        const update = await studentService.update(req.excelData);
        if (update.statusCode == StatusCodes.INTERNAL_SERVER_ERROR)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(update);
        return res.json(update);
    }
);

router.put("/:id", async (req, res) => {
    const student = await studentService.edit(
        parseInt(req.params.id),
        req.body,
        req.name,
        req.role
    );
    if (student.statusCode == StatusCodes.NOT_FOUND)
        return res.status(StatusCodes.NOT_FOUND).send(student);
    res.send(student);
});

router.put("/status/:id", async (req, res) => {
    const student = await studentService.status(
        parseInt(req.params.id),
        req.body,
        req.name,
        req.role
    );
    res.status(student.statusCode).send(student);
});

router.delete("/:id", async (req, res) => {
    const student = await studentService.delete(
        parseInt(req.params.id),
        req.name,
        req.role
    );
    if (student.statusCode == StatusCodes.NOT_FOUND)
        return res.status(StatusCodes.NOT_FOUND).send(student);
    return res.send(student);
});

export default router;
