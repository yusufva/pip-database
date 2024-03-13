import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import indexRouter from "./routes/index.js";
import userRouter from "./routes/users.js";
import studentRoute from "./routes/studentRoute.js";

var app = express();

app.use(
    cors({
        origin: function (origin, callback) {
            console.log(`Origin ${origin} is being granted CORS access`);
            callback(null, true);
        },
        credentials: true,
        exposedHeaders: ["set-cookie"],
        methods: "GET, PUT, POST, DELETE, HEAD, OPTIONS",
    })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/student", studentRoute);

export default app;
