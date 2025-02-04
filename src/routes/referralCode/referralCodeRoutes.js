import express from "express";
import * as referralController from "../../controllers/referralController/referralController.js";
import verifyToken from "../../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/referral-codes")
  .post(verifyToken, referralController.generateReferralCodes)
  .get(verifyToken, referralController.getAllReferralCodes)
  .patch(verifyToken, referralController.updateReferralCode)
  .delete(verifyToken, referralController.deleteReferralCode);

export default router;
