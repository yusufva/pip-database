import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) return res.sendStatus(403);
        req.id = decode.userId;
        req.name = decode.name;
        req.role = decode.role;
        next();
    });
};

const auth = (roles) => async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null) return res.status(401).json({ message: "no token" });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if (err) return res.sendStatus(403);
            if (!roles.includes(decode.role))
                return res.status(401).json({ message: "Unauthorized" });
            req.user = decode;
            next();
        });
    } catch (e) {
        res.status(500).json({ message: "something went wrong" });
    }
};

const authId = (id) => async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null) return res.status(401).json({ message: "no token" });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if (err) return res.sendStatus(403);
            if (!id.includes(decode.userId))
                return res.status(401).json({ message: "Unauthorized" });
            req.user = decode;
            next();
        });
    } catch (e) {
        res.status(500).json({ message: "something went wrong" });
    }
};

module.exports = { auth, verifyToken, authId };
