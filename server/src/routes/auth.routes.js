import express from "express";
import signUp from "../controllers/signUp.controller.js";
import signin from "../controllers/signin.controller.js";
import authAdmin, { verifyToken } from "../middlewares/auth.midware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signin);

router.get("/me", verifyToken, (req, res) => {
    res.status(200).json({ status: "success", user: req.user });
});

router.post("/signout", (req, res) => {
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ status: "success", message: "signed out." });
});

router.get("/adminpage", authAdmin, (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: `welcome to the admin page, ${req.user.name}.`,
        });
    } catch (er) {
        console.error("something went wrong while accessing admin page: ", er);
    }
});

export default router;