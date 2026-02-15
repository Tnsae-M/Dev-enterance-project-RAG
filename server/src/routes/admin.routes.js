import express from "express";
import authAdmin from "../middlewares/auth.midware.js";
import DB from "../config/db.js";

const router = express.Router();

router.get("/users", authAdmin, (req, res) => {
    try {
        const users = DB.prepare(
            "select id, name, username, email, role, created_at from users order by id"
        ).all();
        res.status(200).json({ status: "success", users });
    } catch (er) {
        console.error("Admin list users error:", er);
        res.status(500).json({ status: "failed", message: "Failed to list users." });
    }
});

router.delete("/users/:id", authAdmin, (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ status: "failed", message: "Invalid user id." });
        }
        const result = DB.prepare("delete from users where id = ?").run(id);
        if (result.changes === 0) {
            return res.status(404).json({ status: "failed", message: "User not found." });
        }
        res.status(200).json({ status: "success", message: "User deleted." });
    } catch (er) {
        console.error("Admin delete user error:", er);
        res.status(500).json({ status: "failed", message: "Failed to delete user." });
    }
});

export default router;
