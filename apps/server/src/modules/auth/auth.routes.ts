import { Router } from "express";
import {registerUser, loginUser} from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate";
import { loginSchema, registerSchema } from "./auth.schema";
const router=Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me",authenticate, (req, res) => {
    // add data base querry to fetch user info
    return res.json({
        user:req.user,
    });
});
router.post("/logout", (req, res) => {
    res.clearCookie("token",{
        httpOnly:true,
        sameSite:"lax", // none if there is any issue with cookie
        secure:false,
    })
    return res.status(200).json({
        message: "Logged out successfully",
    })
})
export default router;