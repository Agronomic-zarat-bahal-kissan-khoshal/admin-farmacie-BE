import express from "express";
import * as queryCtrl from "../../controllers/query/query.controller.js";
import verifyToken from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/ticket")
    .post(verifyToken, queryCtrl.createNewQueryTicket)

router.get("/ticket/all", verifyToken, queryCtrl.getAllTickets);
router.post("/viewed", verifyToken, queryCtrl.setQueryViewed);
router.post("/response", verifyToken, queryCtrl.respondToTicket);
router.get("/ticket-chat", verifyToken, queryCtrl.getTicketChat);
router.get("/stats", verifyToken, queryCtrl.newQueryStats);

export default router;