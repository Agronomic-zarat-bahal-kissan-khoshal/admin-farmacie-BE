import express from "express";
import * as cropVarietyCtrl from "../../controllers/crop/cropVariety.controller.js";
import verifyToken, { isAdmin } from "../../middlewares/authMiddleware.js"

const router = express.Router();

router.route("/")
    .post(verifyToken, cropVarietyCtrl.addCropVariety)
    .patch(verifyToken, cropVarietyCtrl.updateCropVariety)
    .get(verifyToken, cropVarietyCtrl.getSingleCropVariety)
    .delete(verifyToken, isAdmin, cropVarietyCtrl.deleteCropVariety);

router.get("/all", verifyToken, cropVarietyCtrl.getAllCropVarieties);
router.get("/list", verifyToken, cropVarietyCtrl.getCropVarietiesList)
router.patch("/already-on-farmacie", verifyToken, cropVarietyCtrl.alreadyOnFarmacie)


export default router;