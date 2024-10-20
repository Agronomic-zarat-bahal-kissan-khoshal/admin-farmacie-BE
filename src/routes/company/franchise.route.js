import express from "express";
import * as franchiseCtrl from "../../controllers/company/franchise.controller.js";
import verifyToken from "../../middlewares/authMiddleware.js";

const router = express.Router();


router.route('/stats').get(verifyToken, franchiseCtrl.companyFranchisesStats);
router.route('/all').get(verifyToken, franchiseCtrl.viewCompanyFranchises);


export default router;



