import jwt from "jsonwebtoken";
import DB from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

// Verify JWT and attach full user from DB (for /me and general auth)
async function verifyToken(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                status: "failed",
                message: "unauthorized access! please signin to continue.",
            });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = DB.prepare("select id, name, username, email, role from users where id=?").get(verified.id);
        if (!user) {
            return res.status(401).json({
                status: "failed",
                message: "user not found.",
            });
        }
        req.user = user;
        next();
    } catch (er) {
        return res.status(401).json({
            status: "failed",
            message: "invalid or expired session. please sign in again.",
        });
    }
}

// Auth middleware for admin-only routes
async function authAdmin(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                status: "failed",
                message: "unauthorized access! please signin to continue.",
            });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified.role !== "admin") {
            return res.status(403).json({
                status: "failed",
                message: "access denied! admin previlages required.",
            });
        }
        const user = DB.prepare("select id, name, username, email, role from users where id=?").get(verified.id);
        req.user = user || verified;
        next();
    } catch (er) {
        console.error("something went wrong while authorizing admin: ", er);
        res.status(500).json({
            status: "failed",
            message: "something went wrong while authorizing admin. please try again later.",
        });
    }
}

export default authAdmin;
export { verifyToken };