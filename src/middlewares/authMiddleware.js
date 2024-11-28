import jwt from "jsonwebtoken";
import { UnauthorizedError, forbiddenError } from "../utils/responses.js";
import { jwtSecret } from "../config/initialConfig.js";
import DashboardUser from "../models/auth/dashboardUser.model.js";

// Middleware to validate JWT tokens
export default function verifyToken(req, res, next) {
  try {
    // Extract the token from the Authorization header
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return UnauthorizedError(res, 'No token, authorization denied');
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.token !== 'access') return UnauthorizedError(res, "Invalid token");
    req.userUid = decoded.userUid;
    next();
  } catch (error) {
    return UnauthorizedError(res, "Invalid token");
  }
}

// ============================= isAdmin ==============================

export async function isAdmin(req, res, next) {
  const user = await DashboardUser.findByPk(req.userUid);
  if (!user) return UnauthorizedError(res, "Invalid token");
  if (!user.is_admin) return forbiddenError(res, "Access denied. Only admin allowed to perform this operation.");
  req.user = user;
  next();
}