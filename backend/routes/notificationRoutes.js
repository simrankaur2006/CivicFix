import { Router } from "express";
import { requireAuth, attachUser } from "../middleware/auth.js";
import { getNotifications, markRead } from "../controllers/notificationController.js";

const router = Router();

router.use(requireAuth, attachUser);
router.get("/", getNotifications);
router.put("/:id/read", markRead);

export default router;
