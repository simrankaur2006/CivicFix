import { Router } from "express";
import { requireAuth, attachUser } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  getAllComplaintsForMap,
} from "../controllers/complaintController.js";

const router = Router();

router.use(requireAuth, attachUser);

router.post("/", upload.single("image"), createComplaint);
router.get("/", getMyComplaints);
router.get("/map/all", getAllComplaintsForMap);
router.get("/:id", getComplaintById);
router.put("/:id", updateComplaint);

export default router;
