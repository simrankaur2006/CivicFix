import { Router } from "express";
import { requireAuth, attachUser, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  getDashboard,
  getAllComplaints,
  updateStatus,
  assignOfficer,
  changeSeverity,
  changeDepartment,
  resolveComplaint,
} from "../controllers/adminController.js";

const router = Router();

router.use(requireAuth, attachUser, requireAdmin);

router.get("/dashboard", getDashboard);
router.get("/complaints", getAllComplaints);
router.put("/complaints/:id/status", updateStatus);
router.put("/complaints/:id/assign", assignOfficer);
router.put("/complaints/:id/severity", changeSeverity);
router.put("/complaints/:id/department", changeDepartment);
router.post("/complaints/:id/resolve", upload.single("image"), resolveComplaint);

export default router;
