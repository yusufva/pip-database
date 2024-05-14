import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import jwtauth from "./middleware/jwtauth.js";

import studentRoute from "./routes/studentRoute.js";
import familyRoute from "./routes/familyRoute.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

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

app.use("/student", jwtauth.verifyToken(), studentRoute);
app.use("/family", jwtauth.verifyToken(), familyRoute);
app.use("/auth", authRoute);
app.use("/user", jwtauth.verifyToken(), userRoute);

export default app;
