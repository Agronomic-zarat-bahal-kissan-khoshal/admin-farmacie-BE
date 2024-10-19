import express from "express";
import * as companyCtrl from "../../controllers/company/company.controller.js";
import verifyToken from "../../middlewares/authMiddleware.js";

const router = express.Router();




// ADD THE IS ADMIN MIDDLEWARE FOR DELETE
router.route("/global-list")
    .get(verifyToken, companyCtrl.getGlobalListCompanies)
    .post(verifyToken, companyCtrl.addCompniestoGlobalList)
    .delete(verifyToken, companyCtrl.deleteGlobalListCompanies)
    .put(verifyToken, companyCtrl.updateGlobalListCompanies);


router.get("/stats", verifyToken, companyCtrl.getCompaniesStats);

export default router;
