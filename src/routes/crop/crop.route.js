import express from "express";
import * as cropCtrl from "../../controllers/crop/crop.controller.js";
import verifyToken from "../../middlewares/authMiddleware.js"

const router = express.Router();

router.route("/")
    .post(verifyToken, cropCtrl.addCrop)
    .patch(verifyToken, cropCtrl.updateCrop)
    .get(verifyToken, cropCtrl.getSingleCrop)
    .delete(verifyToken, cropCtrl.deleteCrop);

router.get("/all", verifyToken, cropCtrl.getAllCrops);
router.get("/list", verifyToken, cropCtrl.getCropsList)
router.get("/stats", verifyToken, cropCtrl.cropStats)


export default router;