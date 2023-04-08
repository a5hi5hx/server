const pushNotificationController = require("../../controllers/push-notification.controller");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
router.get(
  "/sendNotificationToDevice",
  pushNotificationController.SendNotification
);
router.post(
  "/sendNotificationToDevice",
  pushNotificationController.SendNotificationToDevice
);
module.exports = router;
