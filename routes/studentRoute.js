import express from "express";
import { StatusCodes } from "http-status-codes";
import studentService from "../services/studentService";
import httpRespondsMessage from "../helper/httpRespondsMessage";

var router = express.Router();

router.get("/", async (req, res) => {
    const students = await studentService.getAll();
    res.send(
        httpRespondsMessage.getSuccess("success retrieve data", students) ||
            httpRespondsMessage.getSuccess("success retrieve data", [])
    );
});
router.get("/:id", async (req, res) => {
    const student = await studentService.getById(parseInt(req.params.id));
    if (!student) return res.status(StatusCodes.NOT_FOUND).send(student);
    res.send(student);
});

router.post("/", async (req, res) => {
    const student = await studentService.create(req.body);
    if (student.statusCode == StatusCodes.CONFLICT)
        return res.status(StatusCodes.CONFLICT).send(student);
    res.send(student);
});

router.post("/:id", async (req, res) => {
    const student = await studentService.update(
        parseInt(req.params.id),
        req.body
    );
    if (student.statusCode == StatusCodes.NOT_FOUND)
        return res.status(StatusCodes.NOT_FOUND).send(student);
    res.send(student);
});

router.delete("/:id", async (req, res) => {
    const student = await studentService.deleteById(parseInt(req.params.id));
    if (student.statusCode == StatusCodes.NOT_FOUND)
        return res.status(StatusCodes.NOT_FOUND).send(student);
    return res.send(student);
});
