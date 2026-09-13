import { Router } from "express";
import { requireAuth, attachUser } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { analyzeOnly, checkDuplicateOnly } from "../controllers/complaintController.js";

const router = Router();

router.use(requireAuth, attachUser);
router.post("/analyze", upload.single("image"), analyzeOnly);
router.post("/duplicate-check", checkDuplicateOnly);

export default router;
