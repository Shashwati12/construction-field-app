import { Router } from "express";
import {registerUser, loginUser} from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
const router=Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me",authenticate, (req, res) => {
    return res.json({
        user:req.user,
    });
});
router.post("/logout", (req, res) => {
    res.clearCookie("token",{
        httpOnly:true,
        sameSite:"lax",
        secure:false,
    })
    return res.status(200).json({
        message: "Logged out successfully",
    })
})
export default router;