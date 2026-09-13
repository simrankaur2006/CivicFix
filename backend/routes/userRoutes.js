import { Router } from "express";
import { requireAuth, attachUser } from "../middleware/auth.js";
import { getMe } from "../controllers/userController.js";

const router = Router();
router.get("/me", requireAuth, attachUser, getMe);

export default router;
