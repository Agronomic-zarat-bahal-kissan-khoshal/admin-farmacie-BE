import express from "express";
import * as varietyStagesCtrl from "../../controllers/crop/varietyStages.controller.js";
import verifyToken from "../../middlewares/authMiddleware.js"

const router = express.Router();

router.route("/")
    .post(verifyToken, varietyStagesCtrl.addVarietyStage)
    .patch(verifyToken, varietyStagesCtrl.updateVarietyStage)
    .get(verifyToken, varietyStagesCtrl.getSingleStage)
    .delete(verifyToken, varietyStagesCtrl.deleteVarietyStage);

router.get("/all", verifyToken, varietyStagesCtrl.getAllVarietyStages);



export default router;