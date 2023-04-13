const pushNotificationController = require("../../controllers/push-notification.controller");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
router.get(
  "/sendAddNotification",
  pushNotificationController.SendAddNotification
);
router.post(
  "/sendNotificationToDevice",
  pushNotificationController.SendBookNotification
);
module.exports = router;
