const express = require("express");
const router = express.Router();
const tokenCtrl = require("../controllers/tokenController");
const userCtrl = require("../controllers/usersController");
const authJWT = require("../middlewares/authJWT");
const isAdmin = require("../middlewares/isAdmin");

router.patch("/update-username", authJWT, userCtrl.updateUsername);
router.post("/request-email-update", authJWT, userCtrl.requestEmailUpdate);
router.patch("/confirm-email-update", authJWT, userCtrl.confirmEmailUpdate);

router.post("/forgot-password", tokenCtrl.forgotPassword);
router.post("/reset-password", tokenCtrl.resetPassword);

router.get("/admin/logs", authJWT, isAdmin, async (req, res) => {
  const logs = await require("../models/UserLogs").find().sort({ createdAt: -1 }).lean();
  res.json({ logs });
});

module.exports = router;
