import User from "../models/User.js";

// Promotes the clerk user id set in ADMIN_CLERK_USER_ID env var to admin on server boot (demo convenience only)
export const promoteConfiguredAdmin = async () => {
  const adminId = process.env.ADMIN_CLERK_USER_ID;
  if (!adminId) return;
  await User.findOneAndUpdate(
    { clerkUserId: adminId },
    { clerkUserId: adminId, role: "admin" },
    { upsert: true }
  );
  console.log(`Ensured admin role for clerkUserId: ${adminId}`);
};
