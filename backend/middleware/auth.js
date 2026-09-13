import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import User from "../models/User.js";

export const requireAuth = ClerkExpressRequireAuth();

// Attaches Mongo user (creates one if missing) to req.dbUser
export const attachUser = async (req, res, next) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    let user = await User.findOne({ clerkUserId });
    if (!user) {
      user = await User.create({
        clerkUserId,
        name: req.auth?.sessionClaims?.name || "Citizen",
        email: req.auth?.sessionClaims?.email || "",
        role: "citizen",
      });
    }
    req.dbUser = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.dbUser?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
