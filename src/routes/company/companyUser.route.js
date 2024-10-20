import express from "express";
import * as companyUserCtrl from "../../controllers/company/companyUser.controller.js";
import verifyToken from "../../middlewares/authMiddleware.js";

const router = express.Router();


// ADD THE IS ADMIN MIDDLEWARE FOR DELETE
router.route('/').delete(verifyToken, companyUserCtrl.deleteCompanyUser);
router.route('/list').get(verifyToken, companyUserCtrl.getCompanyUsersList);
router.route("/verify").post(verifyToken, companyUserCtrl.verifyCompanyUser);

router.route("/all").get(verifyToken, companyUserCtrl.gerRegisteredCompanies);



export default router;



