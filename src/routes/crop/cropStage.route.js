import express from "express";
import * as cropStageCtrl from "../../controllers/crop/cropStage.controller.js";
import verifyToken, { isAdmin } from "../../middlewares/authMiddleware.js"

const router = express.Router();

router.route("/")
    .post(verifyToken, cropStageCtrl.addCropStage)
    .patch(verifyToken, cropStageCtrl.updateCropStage)
    .delete(verifyToken, cropStageCtrl.deleteCropStage);

router.get("/all", verifyToken, cropStageCtrl.getCropStages);


export default router;